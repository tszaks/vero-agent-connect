#!/usr/bin/env node
import readline from "node:readline";
import { VeroClient } from "./client.js";

const client = new VeroClient();
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });

type JsonRpcRequest = {
  jsonrpc?: "2.0";
  id?: string | number | null;
  method: string;
  params?: Record<string, unknown>;
};

type ToolDefinition = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
};

const tools: ToolDefinition[] = [
  {
    name: "vero_financial_snapshot",
    description: "Get the user's full Vero financial snapshot, including accounts, budgets, transactions, snapshots, and categories.",
    inputSchema: objectSchema({ transactionLimit: numberSchema("Maximum transactions to return"), transactionOffset: numberSchema("Pagination offset") })
  },
  { name: "vero_accounts", description: "List connected Vero accounts.", inputSchema: objectSchema({}) },
  { name: "vero_transactions", description: "List Vero transactions.", inputSchema: objectSchema({ limit: numberSchema("Maximum transactions"), offset: numberSchema("Pagination offset") }) },
  { name: "vero_budgets", description: "List Vero budgets.", inputSchema: objectSchema({}) },
  { name: "vero_net_worth", description: "Get current net worth from connected Vero accounts.", inputSchema: objectSchema({}) },
  { name: "vero_ask", description: "Ask Vero a natural-language question about the user's finances.", inputSchema: objectSchema({ question: stringSchema("Question to ask Vero") }, ["question"]) },
  { name: "vero_create_budget", description: "Create a Vero budget.", inputSchema: objectSchema({ category: stringSchema("Budget category"), amount: numberSchema("Budget amount"), period: enumSchema(["weekly", "monthly", "yearly"], "Budget period") }, ["category", "amount"]) },
  { name: "vero_update_budget", description: "Update a Vero budget.", inputSchema: objectSchema({ id: stringSchema("Budget ID"), category: stringSchema("Budget category"), amount: numberSchema("Budget amount"), period: enumSchema(["weekly", "monthly", "yearly"], "Budget period") }, ["id"]) },
  { name: "vero_delete_budget", description: "Delete a Vero budget.", inputSchema: objectSchema({ id: stringSchema("Budget ID") }, ["id"]) },
  { name: "vero_create_transaction", description: "Create a manual Vero transaction.", inputSchema: objectSchema({ account_id: stringSchema("Vero account ID"), amount: numberSchema("Transaction amount"), merchant_name: stringSchema("Merchant name"), date: stringSchema("ISO date, YYYY-MM-DD"), category: stringSchema("Category"), notes: stringSchema("Notes") }, ["account_id", "amount", "merchant_name", "date"]) },
  { name: "vero_update_transaction", description: "Update a manual Vero transaction.", inputSchema: objectSchema({ id: stringSchema("Transaction ID"), amount: numberSchema("Transaction amount"), merchant_name: stringSchema("Merchant name"), date: stringSchema("ISO date, YYYY-MM-DD"), category: stringSchema("Category"), notes: stringSchema("Notes") }, ["id"]) }
];

rl.on("line", async (line) => {
  if (!line.trim()) return;

  let request: JsonRpcRequest;
  try {
    request = JSON.parse(line) as JsonRpcRequest;
  } catch (error) {
    write({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } });
    return;
  }

  try {
    const result = await route(request);
    if (request.id !== undefined) {
      write({ jsonrpc: "2.0", id: request.id, result });
    }
  } catch (error) {
    if (request.id !== undefined) {
      write({
        jsonrpc: "2.0",
        id: request.id,
        error: { code: -32000, message: error instanceof Error ? error.message : String(error) }
      });
    }
  }
});

async function route(request: JsonRpcRequest) {
  switch (request.method) {
    case "initialize":
      return {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: { name: "vero-agent-connect", version: "0.1.0" }
      };
    case "tools/list":
      return { tools };
    case "tools/call":
      return callTool(String(request.params?.name ?? ""), asObject(request.params?.arguments));
    default:
      return {};
  }
}

async function callTool(name: string, args: Record<string, unknown>) {
  const result = await callVero(name, args);
  return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
}

function callVero(name: string, args: Record<string, unknown>) {
  switch (name) {
    case "vero_financial_snapshot":
      return client.financialData({ transactionLimit: numberValue(args.transactionLimit, 100), transactionOffset: numberValue(args.transactionOffset, 0) });
    case "vero_accounts":
      return client.accounts();
    case "vero_transactions":
      return client.transactions({ limit: numberValue(args.limit, 25), offset: numberValue(args.offset, 0) });
    case "vero_budgets":
      return client.budgets();
    case "vero_net_worth":
      return client.netWorth();
    case "vero_ask":
      return client.ask(requiredString(args.question, "question"));
    case "vero_create_budget":
      return client.createBudget({ category: requiredString(args.category, "category"), amount: requiredNumber(args.amount, "amount"), period: optionalPeriod(args.period) });
    case "vero_update_budget":
      return client.updateBudget(requiredString(args.id, "id"), compact({ category: optionalString(args.category), amount: optionalNumber(args.amount), period: optionalPeriod(args.period) }));
    case "vero_delete_budget":
      return client.deleteBudget(requiredString(args.id, "id"));
    case "vero_create_transaction":
      return client.createTransaction({ account_id: requiredString(args.account_id, "account_id"), amount: requiredNumber(args.amount, "amount"), merchant_name: requiredString(args.merchant_name, "merchant_name"), date: requiredString(args.date, "date"), category: optionalString(args.category), notes: optionalString(args.notes) });
    case "vero_update_transaction":
      return client.updateTransaction(requiredString(args.id, "id"), compact({ amount: optionalNumber(args.amount), merchant_name: optionalString(args.merchant_name), date: optionalString(args.date), category: optionalString(args.category), notes: optionalString(args.notes) }));
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function write(message: unknown) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

function objectSchema(properties: Record<string, unknown>, required: string[] = []) {
  return { type: "object", properties, required, additionalProperties: false };
}

function stringSchema(description: string) {
  return { type: "string", description };
}

function numberSchema(description: string) {
  return { type: "number", description };
}

function enumSchema(values: string[], description: string) {
  return { type: "string", enum: values, description };
}

function asObject(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function numberValue(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function requiredString(value: unknown, name: string) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`Missing ${name}`);
  return value;
}

function requiredNumber(value: unknown, name: string) {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new Error(`Missing ${name}`);
  return value;
}

function optionalString(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function optionalNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function optionalPeriod(value: unknown) {
  return value === "weekly" || value === "monthly" || value === "yearly" ? value : undefined;
}

function compact<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as Partial<T>;
}

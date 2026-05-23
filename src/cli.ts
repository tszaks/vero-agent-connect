#!/usr/bin/env node
import { VeroClient } from "./client.js";

const client = new VeroClient();
const [command, ...args] = process.argv.slice(2);

async function main() {
  switch (command) {
    case "me":
      return client.me();
    case "accounts":
      return client.accounts();
    case "transactions":
      return client.transactions({ limit: numberArg(args[0], 25), offset: numberArg(args[1], 0) });
    case "budgets":
      return client.budgets();
    case "net-worth":
      return client.netWorth();
    case "financial-data":
      return client.financialData({ transactionLimit: numberArg(args[0], 100), transactionOffset: numberArg(args[1], 0) });
    case "ask":
      return client.ask(args.join(" "));
    default:
      printHelp();
      process.exit(command ? 1 : 0);
  }
}

main()
  .then((result) => {
    if (result !== undefined) {
      console.log(JSON.stringify(result, null, 2));
    }
  })
  .catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });

function numberArg(value: string | undefined, fallback: number) {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function printHelp() {
  console.log(`Usage: vero-api <command>

Commands:
  me
  accounts
  transactions [limit] [offset]
  budgets
  net-worth
  financial-data [transactionLimit] [transactionOffset]
  ask <question>
`);
}

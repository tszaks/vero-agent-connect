export type VeroClientOptions = {
  token?: string;
  baseUrl?: string;
  fetchImpl?: typeof fetch;
};

export type VeroRequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
};

export type VeroBudgetInput = {
  category: string;
  amount: number;
  period?: "weekly" | "monthly" | "yearly";
};

export type VeroTransactionInput = {
  account_id: string;
  amount: number;
  merchant_name: string;
  date: string;
  category?: string;
  notes?: string;
};

export const DEFAULT_VERO_API_BASE_URL =
  "https://api.askvero.app/functions/v1/vero-api/v1";

export class VeroAPIError extends Error {
  readonly status: number;
  readonly details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "VeroAPIError";
    this.status = status;
    this.details = details;
  }
}

export class VeroClient {
  private readonly token: string;
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;

  constructor(options: VeroClientOptions = {}) {
    this.token = options.token ?? process.env.VERO_API_TOKEN ?? "";
    this.baseUrl = (options.baseUrl ?? process.env.VERO_API_BASE_URL ?? DEFAULT_VERO_API_BASE_URL).replace(/\/$/, "");
    this.fetchImpl = options.fetchImpl ?? fetch;

    if (!this.token) {
      throw new Error("Missing VERO_API_TOKEN. Create one in Vero Settings > Developers > API Keys.");
    }
  }

  me() {
    return this.request("/me");
  }

  accounts() {
    return this.request("/accounts");
  }

  transactions(options: { limit?: number; offset?: number } = {}) {
    return this.request("/transactions", { query: options });
  }

  budgets() {
    return this.request("/budgets");
  }

  netWorth() {
    return this.request("/net-worth");
  }

  financialData(options: { transactionLimit?: number; transactionOffset?: number } = {}) {
    return this.request("/financial-data", {
      query: {
        transaction_limit: options.transactionLimit,
        transaction_offset: options.transactionOffset
      }
    });
  }

  ask(question: string) {
    return this.request("/ask", { body: { question } });
  }

  createBudget(input: VeroBudgetInput) {
    return this.request("/budgets", { body: input });
  }

  updateBudget(id: string, patch: Partial<VeroBudgetInput>) {
    return this.request(`/budgets/${encodeURIComponent(id)}`, { method: "PATCH", body: patch });
  }

  deleteBudget(id: string) {
    return this.request(`/budgets/${encodeURIComponent(id)}`, { method: "DELETE" });
  }

  createTransaction(input: VeroTransactionInput) {
    return this.request("/transactions", { body: input });
  }

  updateTransaction(id: string, patch: Partial<VeroTransactionInput>) {
    return this.request(`/transactions/${encodeURIComponent(id)}`, { method: "PATCH", body: patch });
  }

  async request(path: string, options: VeroRequestOptions = {}) {
    const url = new URL(`${this.baseUrl}${path}`);

    for (const [key, value] of Object.entries(options.query ?? {})) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }

    const response = await this.fetchImpl(url, {
      method: options.method ?? (options.body === undefined ? "GET" : "POST"),
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json"
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body)
    });

    const text = await response.text();
    const data = text ? safeJson(text) : null;

    if (!response.ok) {
      const message = getErrorMessage(data) ?? `Vero API request failed with status ${response.status}`;
      throw new VeroAPIError(message, response.status, data);
    }

    return data;
  }
}

function safeJson(text: string) {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function getErrorMessage(data: unknown) {
  if (data && typeof data === "object" && "error" in data && typeof data.error === "string") {
    return data.error;
  }
  return undefined;
}

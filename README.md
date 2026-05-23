# Vero Agent Connect

Vero Agent Connect lets a Vero user connect AI agents to their financial data using a token they create inside the Vero app.

This repo is intentionally separate from Vero's private app and backend code. It contains only public client code, docs, examples, and a small MCP server that talks to the public Vero Agent Access API.

## What agents can do

With a Vero Agent Access token, an agent can:

- Read connected accounts, balances, budgets, transactions, and net worth.
- Ask Vero natural-language questions about the user's finances.
- Create, update, and delete Vero budgets when the token has write access.
- Create and update manual Vero transactions when the token has write access.

Agents cannot:

- Move money.
- Make payments.
- Open or close bank accounts.
- Access bank credentials.
- See a token after the user leaves the Vero token creation screen.

## Create a token

In the Vero app:

1. Open `Settings`.
2. Tap `Developers`.
3. Tap `API Keys`.
4. Tap `Create Agent Token`.
5. Name the token, for example `Claude Desktop`, `OpenClaw`, or `Hermes`.
6. Copy the token once and store it in the agent's environment.

You can revoke a token from the same screen at any time.

## Quick start

```bash
npm install
cp .env.example .env
npm run build
```

Add your token to `.env`:

```bash
VERO_API_TOKEN=vero_live_replace_me
```

Try the CLI:

```bash
VERO_API_TOKEN=vero_live_replace_me npx vero-api net-worth
VERO_API_TOKEN=vero_live_replace_me npx vero-api financial-data 100 0
VERO_API_TOKEN=vero_live_replace_me npx vero-api ask "Where did I overspend this month?"
```

## Claude Desktop MCP config

Build the server first:

```bash
npm run build
```

Then add this to your Claude Desktop MCP config:

```json
{
  "mcpServers": {
    "vero": {
      "command": "node",
      "args": ["/absolute/path/to/vero-agent-connect/dist/mcp-server.js"],
      "env": {
        "VERO_API_TOKEN": "vero_live_replace_me"
      }
    }
  }
}
```

## MCP tools

The MCP server exposes these tools:

- `vero_financial_snapshot`
- `vero_accounts`
- `vero_transactions`
- `vero_budgets`
- `vero_net_worth`
- `vero_ask`
- `vero_create_budget`
- `vero_update_budget`
- `vero_delete_budget`
- `vero_create_transaction`
- `vero_update_transaction`

## API base URL

The default production API is:

```text
https://api.askvero.app/functions/v1/vero-api/v1
```

You can override it with:

```bash
VERO_API_BASE_URL=https://your-api.example.com/v1
```

## Security notes

Treat a Vero Agent Access token like a password. Store it in your agent's environment or secret store. Do not paste it into prompts, commit it, or share it in screenshots.

This connector never asks for Plaid credentials, bank credentials, Supabase keys, or Vero internal service keys.

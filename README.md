# Vero Agent Connect

Public connector for giving AI agents controlled access to a user's Vero financial data.

Vero Agent Connect includes:

- A TypeScript client for the Vero Agent Access API.
- A local MCP server for Claude Desktop, Cursor, OpenClaw, Hermes Agents, and other MCP-compatible tools.
- A small CLI for quick checks and automation scripts.
- An OpenAPI spec for code generation and LLM tool use.

This repository is intentionally separate from Vero's private app and backend code. It contains public client code, examples, and documentation only.

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
- See Plaid credentials.
- See Vero internal service-role keys.
- Recover a token after the user leaves the token creation screen.

## Create a token

In the Vero iOS app:

1. Open `Settings`.
2. Open `Developers`.
3. Open `API Keys`.
4. Tap `Create Agent Token`.
5. Name the token, for example `Claude Desktop`, `OpenClaw`, or `Hermes`.
6. Copy the token once and store it in the agent's environment.

You can revoke a token from the same screen at any time.

## Quick start

```bash
git clone https://github.com/tszaks/vero-agent-connect.git
cd vero-agent-connect
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
VERO_API_TOKEN=vero_live_replace_me node dist/cli.js net-worth
VERO_API_TOKEN=vero_live_replace_me node dist/cli.js financial-data 100 0
VERO_API_TOKEN=vero_live_replace_me node dist/cli.js ask "Where did I overspend this month?"
```

## Claude Desktop MCP setup

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

Restart Claude Desktop after saving the config.

## Hermes Agent or OpenClaw setup

Use the MCP server as a local tool process:

```bash
npm install
npm run build
VERO_API_TOKEN=vero_live_replace_me node dist/mcp-server.js
```

Set these environment variables in your agent runtime:

```bash
VERO_API_TOKEN=vero_live_replace_me
VERO_API_BASE_URL=https://api.askvero.app/functions/v1/vero-api/v1
```

`VERO_API_BASE_URL` is optional unless you are developing against a non-production Vero host.

## MCP tools

The MCP server exposes:

| Tool | Purpose |
| --- | --- |
| `vero_financial_snapshot` | Full financial snapshot with accounts, budgets, transactions, snapshots, and categories. |
| `vero_accounts` | Connected account list. |
| `vero_transactions` | Paginated transaction list. |
| `vero_budgets` | Budget list. |
| `vero_net_worth` | Current net worth. |
| `vero_ask` | Natural-language Vero finance question. |
| `vero_create_budget` | Create a budget. |
| `vero_update_budget` | Update a budget. |
| `vero_delete_budget` | Delete a budget. |
| `vero_create_transaction` | Create a manual transaction. |
| `vero_update_transaction` | Update a manual transaction. |

## TypeScript client

```ts
import { VeroClient } from "@askvero/agent-connect";

const vero = new VeroClient({
  token: process.env.VERO_API_TOKEN
});

const netWorth = await vero.netWorth();
const transactions = await vero.transactions({ limit: 25, offset: 0 });
const answer = await vero.ask("What changed in my spending this week?");
```

## API base URL

The default production API is:

```text
https://api.askvero.app/functions/v1/vero-api/v1
```

Override it only for development:

```bash
VERO_API_BASE_URL=https://your-api.example.com/functions/v1/vero-api/v1
```

## OpenAPI

The API surface is described in [`openapi.json`](./openapi.json). Use it for:

- Generating typed clients.
- Creating custom GPT Actions.
- Building hosted tools for agents that do not speak MCP.
- Giving LLMs a structured view of the API.

## LLM-readable docs

This repo includes [`llms.txt`](./llms.txt), a compact map for LLMs and coding agents. If you are connecting another agent to Vero, start there.

## Security model

Vero Agent Access tokens are user-scoped. Treat them like passwords.

- Store tokens in environment variables or a secret manager.
- Never paste tokens into prompts.
- Never commit tokens.
- Never expose tokens in frontend code.
- Revoke tokens from Vero Settings if a device, repo, prompt, or agent session may have leaked one.

This connector never asks for bank credentials, Plaid credentials, Supabase keys, Apple keys, Google OAuth secrets, or Vero service-role keys.

## Development

```bash
npm install
npm run build
npm run dev:cli -- net-worth
npm run dev:mcp
```

The source is intentionally small:

```text
src/client.ts       TypeScript API client
src/cli.ts          CLI wrapper
src/mcp-server.ts   MCP JSON-RPC server
openapi.json        OpenAPI description
examples/           Copy-paste integration examples
```

## Status

This connector is early and intentionally conservative. The API may expand, but breaking changes should be avoided where practical.

## License

MIT

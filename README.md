<h1 align="center">Vero Agent Connect</h1>

<p align="center">
  The public connector that lets AI agents read, and optionally edit, a user's Vero financial data with a token the user creates.
</p>

<p align="center">
  <a href="https://github.com/tszaks/vero-agent-connect/actions/workflows/ci.yml"><img src="https://github.com/tszaks/vero-agent-connect/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/tszaks/vero-agent-connect" alt="MIT license"></a>
  <img src="https://img.shields.io/badge/Node-20%2B-339933" alt="Node 20 or later">
</p>

```text
$ VERO_API_TOKEN=vero_live_replace_me node dist/cli.js ask "Where did I overspend this month?"
```

Vero Agent Connect is a TypeScript client, a local MCP server and a small command line tool for the Vero Agent Access API. It is for developers who want Claude Desktop, Cursor, OpenClaw, Hermes Agent or any other MCP-compatible tool to answer questions about a Vero user's accounts, budgets and transactions.

The user stays in control. Access works only through a token the user creates in the Vero app and can revoke at any time. This repository is separate from Vero's private app and backend. It holds public client code, an OpenAPI spec, examples and docs only.

## Features

- **TypeScript client.** `VeroClient` wraps every endpoint in the API, with typed inputs and a `VeroAPIError` that carries the HTTP status.
- **Local MCP server.** Eleven tools over stdio JSON-RPC, started with `node dist/mcp-server.js`.
- **Command line tool.** `vero-api` for quick checks and scripts.
- **OpenAPI 3.1 spec.** [`openapi.json`](openapi.json) for generated clients, custom GPT Actions and hosted tools.
- **Read first, write only with permission.** Budgets and manual transactions can be changed only when the token has write access.
- **No money movement.** The API cannot move money, make payments or open or close bank accounts.
- **Small and dependency free.** Nothing at runtime beyond Node 20+. The build needs TypeScript.

## Install

This package is not published to npm yet. Build it from source. You need Node 20 or later.

```bash
git clone https://github.com/tszaks/vero-agent-connect.git
cd vero-agent-connect
npm install
cp .env.example .env
npm run build
```

### Create a token

In the Vero iOS app:

1. Open `Settings`.
2. Open `Developers`.
3. Open `API Keys`.
4. Tap `Create Agent Token`.
5. Name the token, for example `Claude Desktop`, `OpenClaw` or `Hermes`.
6. Copy the token once and store it in the agent's environment. Vero cannot show it again.

You can revoke a token from the same screen at any time.

## Usage

### Command line

The tool reads `VERO_API_TOKEN` from the environment. It does not read `.env` by itself, so export the variable or put it in front of the command.

```bash
export VERO_API_TOKEN=vero_live_replace_me
node dist/cli.js net-worth
node dist/cli.js financial-data 100 0
node dist/cli.js ask "Where did I overspend this month?"
```

| Command | What it does |
| --- | --- |
| `me` | Show metadata about the user and token in use. |
| `accounts` | List connected accounts. |
| `transactions [limit] [offset]` | List transactions (defaults: 25 and 0). |
| `budgets` | List budgets. |
| `net-worth` | Show current net worth. |
| `financial-data [transactionLimit] [transactionOffset]` | Full snapshot (defaults: 100 and 0). |
| `ask <question>` | Ask Vero a natural-language question. |

The command line tool is read-only. Creating and changing budgets and transactions is available through the client and the MCP server.

### TypeScript client

```ts
import { VeroClient } from "./dist/index.js";

const vero = new VeroClient({ token: process.env.VERO_API_TOKEN });

const netWorth = await vero.netWorth();
const transactions = await vero.transactions({ limit: 25, offset: 0 });
const answer = await vero.ask("What changed in my spending this week?");
```

The package name in `package.json` is `@askvero/agent-connect`. Once it is published, you can import from that name instead.

### MCP server

Build first with `npm run build`. Then run the server directly:

```bash
VERO_API_TOKEN=vero_live_replace_me node dist/mcp-server.js
```

Most agents start it for you from a config file.

**Claude Desktop.** Add this to your Claude Desktop MCP config, then restart the app. Use the real absolute path to your checkout. The same file is in [`examples/claude-desktop.json`](examples/claude-desktop.json).

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

**Other MCP clients (Cursor, OpenClaw, Hermes Agent).** Run `node dist/mcp-server.js` as a local stdio tool process and set `VERO_API_TOKEN` in the agent's environment. Each client has its own config format. The command and environment are the same as above.

| Tool | What it does |
| --- | --- |
| `vero_financial_snapshot` | Full financial snapshot with accounts, budgets, transactions, snapshots and categories. |
| `vero_accounts` | List connected accounts. |
| `vero_transactions` | Paginated transaction list. |
| `vero_budgets` | List budgets. |
| `vero_net_worth` | Current net worth. |
| `vero_ask` | Ask a natural-language question about the user's finances. |
| `vero_create_budget` | Create a budget. Needs write access. |
| `vero_update_budget` | Update a budget. Needs write access. |
| `vero_delete_budget` | Delete a budget. Needs write access. |
| `vero_create_transaction` | Create a manual transaction. Needs write access. |
| `vero_update_transaction` | Update a manual transaction. Needs write access. |

### Raw HTTP

[`examples/curl.sh`](examples/curl.sh) shows a plain `curl` call with the bearer token.

## Configuration

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `VERO_API_TOKEN` | Yes | none | The user's Vero Agent Access token. Sent as `Authorization: Bearer`. |
| `VERO_API_BASE_URL` | No | `https://api.askvero.app/functions/v1/vero-api/v1` | Override only when developing against a non-production Vero host. |

`new VeroClient({ token, baseUrl })` accepts the same two values and takes priority over the environment. The client throws at construction if no token is set.

## Made for AI agents

If you are an agent connecting to Vero, start with [`llms.txt`](llms.txt). It is a compact map of this repository, the safety rules and the recommended behavior. [`openapi.json`](openapi.json) has the exact request shapes, and [`src/client.ts`](src/client.ts) has the exact request behavior. If you are an agent working on this repository's code, read [AGENTS.md](AGENTS.md).

Good agent behavior with this connector:

- Prefer read-only analysis. Change a budget or transaction only when the user clearly asks.
- Never print, log or paste the token into a prompt.
- Never ask the user for bank credentials, Plaid credentials or Vero service keys. This connector needs none of them.

## FAQ

**Can an agent move my money?**
No. The API cannot move money, make payments, open or close bank accounts, or reach bank credentials.

**What can a token see?**
Only the data of the user who created it: accounts, balances, budgets, transactions and net worth. Writes need a token with write access.

**What if a token leaks?**
Revoke it in the Vero app (Settings > Developers > API Keys). Create a new one.

**Does this connector send data anywhere else?**
It makes requests only to the Vero API at the base URL above. It has no analytics and no other network calls. Whatever an agent does with the data it receives depends on that agent.

**Can I get the token again?**
No. Vero shows it once, when you create it. Make a new token if you lose it.

## Security model

Vero Agent Access tokens are user-scoped. Treat them like passwords.

- Store tokens in environment variables or a secret manager.
- Never paste tokens into prompts.
- Never commit tokens.
- Never expose tokens in frontend code.
- Revoke tokens from the Vero app if a device, repo, prompt or agent session may have leaked one.

See [SECURITY.md](SECURITY.md) to report a vulnerability.

## Development

```bash
npm install
npm run build
npm run dev:cli -- net-worth
npm run dev:mcp
```

```text
src/client.ts       TypeScript API client
src/cli.ts          CLI wrapper
src/mcp-server.ts   MCP JSON-RPC server
src/index.ts        Package exports
openapi.json        OpenAPI description
examples/           Copy-paste integration examples
```

## Status

Early and intentionally conservative. The API may grow, and breaking changes are avoided where practical. There are no automated tests yet. CI builds the TypeScript.

## Contributing

Bug reports and pull requests are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) first. Security problems go through [SECURITY.md](SECURITY.md). Everyone taking part follows the [Code of Conduct](CODE_OF_CONDUCT.md).

Docs: [llms.txt](llms.txt) · [OpenAPI](openapi.json) · [agent guide](AGENTS.md) · [changelog](CHANGELOG.md)

## License

[MIT](LICENSE)

# Vero Agent Connect

The public connector for the Vero Agent Access API: a TypeScript client, a local MCP server (stdio JSON-RPC) and a small CLI. TypeScript 5, ESM, Node 20+, no runtime dependencies. Dev dependencies are `typescript`, `tsx` and `@types/node`.

This file is for AI agents that work **on** this repository's code. If you are an agent that **uses** Vero through this connector, read [llms.txt](llms.txt) and [README.md](README.md) instead.

## Build, run, test
- Install and build: `npm install` then `npm run build` (`tsc`, output in `dist/`). CI runs the same build. Run it before you say something works.
- There is no test suite. Do not claim tests passed.
- Run from source: `npm run dev:cli -- <command>` and `npm run dev:mcp` (both use `tsx` and need `VERO_API_TOKEN` in the environment).
- Check the MCP server without a token or the network: `printf '%s\n' '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | VERO_API_TOKEN=x node dist/mcp-server.js`.
- Never run a command that calls the real API with a real token unless the user asks. Use a placeholder such as `vero_live_replace_me`.

## Code map
- `src/client.ts`: `VeroClient` (one method per endpoint, plus `request`), `VeroAPIError`, `DEFAULT_VERO_API_BASE_URL`. The token and base URL come from options or `VERO_API_TOKEN` and `VERO_API_BASE_URL`.
- `src/mcp-server.ts`: the tool list, JSON-RPC routing (`initialize`, `tools/list`, `tools/call`) and argument checks.
- `src/cli.ts`: the `vero-api` command (read-only commands only).
- `src/index.ts`: package exports.
- `openapi.json`: OpenAPI 3.1 description of the API.
- `llms.txt`: compact map for other agents. `examples/`: Claude Desktop config and a curl script.

## Conventions
- Match the surrounding code: naming, comment density, idiom. Prefer simple TypeScript and explicit code over clever abstractions.
- Do not add dependencies without discussion.
- Keep examples on placeholder tokens only.
- When you add, rename or remove an endpoint or MCP tool, update `README.md`, `llms.txt`, `openapi.json`, `src/client.ts`, `src/mcp-server.ts` and `examples/` together, and add a line to `CHANGELOG.md`.

## Safety rules
- Never commit real `VERO_API_TOKEN` values.
- Never add Vero private backend code to this repo.
- Never add Supabase service-role keys, Plaid secrets, Apple keys, Google OAuth secrets or bank credentials.
- Never log or print the token or `Authorization` headers.
- Do not claim this API can move money. It cannot.

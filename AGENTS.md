# AGENTS.md

Guidance for coding agents working in this repository.

## Project purpose

`vero-agent-connect` is a public connector for Vero Agent Access. It should stay small, safe, and easy for developers and LLMs to understand.

## Safety rules

- Never commit real `VERO_API_TOKEN` values.
- Never add Vero private backend code to this repo.
- Never add Supabase service-role keys, Plaid secrets, Apple keys, Google OAuth secrets, or bank credentials.
- Do not claim this API can move money. It cannot.
- Keep examples using placeholder tokens only.

## Files to keep in sync

When changing API or MCP behavior, update all relevant files:

- `README.md`
- `llms.txt`
- `openapi.json`
- `src/client.ts`
- `src/mcp-server.ts`
- `examples/`

## Development

Run:

```bash
npm install
npm run build
```

Prefer simple TypeScript and minimal dependencies.

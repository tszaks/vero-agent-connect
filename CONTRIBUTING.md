# Contributing

Thanks for improving Vero Agent Connect.

## Principles

- Keep the connector small and predictable.
- Prefer explicit code over clever abstractions.
- Do not add dependencies unless they clearly improve developer experience or safety.
- Never commit secrets.
- Keep examples copy-pasteable.
- Keep LLM-facing docs accurate when tools or endpoints change.

## Local setup

```bash
git clone https://github.com/tszaks/vero-agent-connect.git
cd vero-agent-connect
npm install
cp .env.example .env
npm run build
```

Add a real `VERO_API_TOKEN` only to your local `.env`.

## Before opening a PR

Run:

```bash
npm run build
```

Then check:

- `README.md` still matches the behavior.
- `llms.txt` still lists the correct tools and safety rules.
- `openapi.json` still describes the API accurately.
- Examples do not include real tokens.

## API changes

If you add, rename, or remove an endpoint or MCP tool, update:

- `README.md`
- `llms.txt`
- `openapi.json`
- `src/client.ts`
- `src/mcp-server.ts`
- `examples/`

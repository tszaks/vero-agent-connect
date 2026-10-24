# Contributing to Vero Agent Connect

Thanks for helping. This connector has a narrow job: give AI agents safe, predictable access to a user's Vero data. A change is welcome if it keeps the code **small, explicit and safe**.

By taking part you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Before you start

- For bugs, open an issue with the template. Say which entry point you used (client, CLI or MCP server) and the exact command.
- For features, open an issue first and describe the problem. The API surface is defined by Vero's backend, so this repository can only expose what the API already offers.
- Small fixes (typos, clear bugs) can go straight to a pull request.
- Security problems go through [SECURITY.md](SECURITY.md), not a public issue.

## Setup

You need Node 20 or later.

```bash
git clone https://github.com/tszaks/vero-agent-connect.git
cd vero-agent-connect
npm install
cp .env.example .env
npm run build
```

Add a real `VERO_API_TOKEN` only to your local `.env`. It is git-ignored. The command line tool and the MCP server read the variable from the process environment, not from `.env`, so export it in your shell when you try them.

## Run it

```bash
npm run dev:cli -- net-worth    # CLI from source
npm run dev:mcp                 # MCP server from source
```

## Check your change

There is no test suite yet. Before you open a pull request, run the build. It type-checks everything:

```bash
npm run build
```

CI runs the same command on Node 20. If you add behavior that can be tested without a real token, tests are welcome. The client accepts a `fetchImpl` option so you can test it without the network.

## Code style

- **Match the surrounding code.** Same naming, same comment density, same idiom as the file you are editing. There is no formatter to run, so read the neighbors.
- **Keep it simple.** Prefer explicit code over clever abstractions.
- **No new dependencies** unless they clearly improve developer experience or safety. Discuss first.
- Keep examples copy-pasteable and keep them on placeholder tokens such as `vero_live_replace_me`.

## Safety

This connector touches financial data. Never commit a real token, and never add private Vero backend code, service keys, Plaid secrets, Apple keys, Google OAuth secrets or bank credentials. Never write docs or code that claim the API can move money. It cannot.

## API changes

If you add, rename or remove an endpoint or MCP tool, update all of these in the same pull request:

- `README.md`
- `llms.txt`
- `openapi.json`
- `src/client.ts`
- `src/mcp-server.ts`
- `examples/`

## Pull request checklist

- [ ] `npm run build` passes.
- [ ] The change is small and focused. Unrelated cleanups go in their own pull request.
- [ ] The code matches the surrounding style and adds no dependency.
- [ ] `README.md`, `llms.txt` and `openapi.json` still match the behavior.
- [ ] No real tokens, in code, examples, logs or screenshots.
- [ ] A line added under `[Unreleased]` in [CHANGELOG.md](CHANGELOG.md) for anything a user would notice.

## Using AI agents to contribute

Fine, as long as you read and understand what you submit and the checklist above is true. [AGENTS.md](AGENTS.md) tells coding agents how this repository works.

## License

By contributing you agree that your contribution is licensed under the [MIT License](LICENSE).

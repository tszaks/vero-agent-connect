# Security Policy

Vero handles sensitive financial data. Please treat all integrations with extra care.

## Supported versions

This repository is early. Security fixes should target the latest `main` branch unless a tagged release states otherwise.

## Reporting a vulnerability

Please do not open a public GitHub issue for a vulnerability.

Email Tyler Szakacs at `tyler@szakacsmedia.com` with:

- A short description of the issue.
- Steps to reproduce.
- Affected files or endpoints.
- Whether any token or financial data may have been exposed.

## Token handling

Vero Agent Access tokens are user-scoped secrets.

Do not:

- Commit real tokens.
- Paste real tokens into prompts.
- Put real tokens in frontend code.
- Share screenshots containing real tokens.
- Log request headers containing `Authorization`.

Do:

- Store tokens in environment variables or a secret manager.
- Revoke tokens from Vero Settings if exposure is possible.
- Keep generated examples using placeholder values such as `vero_live_replace_me`.

## Financial safety boundaries

This connector cannot move money, make payments, open bank accounts, close bank accounts, or access bank credentials.

If an agent claims otherwise, the agent is wrong.

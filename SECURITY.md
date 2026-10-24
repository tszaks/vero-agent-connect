# Security policy

Vero handles sensitive financial data. Please treat all integrations with extra care.

## Supported versions

Only the latest `main` branch gets security fixes. This repository has no tagged releases yet.

| Version | Supported |
|---|---|
| `main` (latest) | Yes |
| Older commits | No |

## Reporting a vulnerability

Please report security problems privately, not in a public issue.

Use GitHub private vulnerability reporting: open the **Security** tab of this repository and choose **Report a vulnerability**. If that is not available to you, email tyler@szakacsmedia.com.

Please include:

- A short description of the issue and what an attacker could do with it.
- Steps to reproduce.
- Affected files or endpoints.
- Whether any token or financial data may have been exposed.

You can expect a first reply within a few days. This project is maintained by a small team, so a fix may take longer, but you will get updates. Once a fix is released we will credit you in the changelog unless you prefer to stay anonymous.

## Sensitive surface

This connector carries a user's Vero Agent Access token and returns their financial data to an AI agent. These areas matter most:

- Anything that logs, prints or leaks the token, or sends it to a host other than the configured Vero API.
- Anything that lets the connector change data the user did not ask to change.
- Anything that sends financial data to a destination other than the agent that asked for it.

Problems in the Vero app or backend itself are out of scope for this repository. Report them to the same address.

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
- Revoke tokens from the Vero app (Settings > Developers > API Keys) if exposure is possible.
- Keep generated examples using placeholder values such as `vero_live_replace_me`.

## Financial safety boundaries

This connector cannot move money, make payments, open bank accounts, close bank accounts, or access bank credentials.

If an agent claims otherwise, the agent is wrong.

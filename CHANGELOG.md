# Changelog

All notable changes to Vero Agent Connect are listed here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). The package version is `0.1.0` and the repository has no tagged releases yet.

## [Unreleased]

### Added
- Contributor docs: Code of Conduct, changelog, issue and pull request templates, and a CI workflow that builds the TypeScript.

### Changed
- README, CONTRIBUTING, SECURITY and AGENTS.md follow one house format.

## [0.1.0] - 2026-05-22

First public version.

### Added
- `VeroClient`, a TypeScript client for the Vero Agent Access API, with typed budget and transaction inputs and `VeroAPIError`.
- A local MCP server (`vero-mcp`) with eleven tools: financial snapshot, accounts, transactions, budgets, net worth, ask, and create, update and delete for budgets and manual transactions.
- A command line tool (`vero-api`) with `me`, `accounts`, `transactions`, `budgets`, `net-worth`, `financial-data` and `ask`.
- `openapi.json`, an OpenAPI 3.1 description of the API.
- `llms.txt`, a compact guide for LLMs and coding agents.
- Examples for Claude Desktop and curl, pointed at the AskVero API host.
- MIT license.

# claude-usage-cli

CLI for Claude API usage and cost reports. Uses the Anthropic Admin API ([Usage & Cost API](https://platform.claude.com/docs/en/build-with-claude/usage-cost-api)).

## Requirements

- Node.js 18+
- macOS (uses Keychain for credential storage)

## Install

```bash
npm install -g claude-usage-cli
```

Or run without installing:

```bash
npx claude-usage-cli
```

## Commands

### config set-key

Store your Admin API key in macOS Keychain. Requires an Admin API key (starts with `sk-ant-admin`) from Claude Console → Settings → Admin Keys.

```bash
claude-usage config set-key
```

### config show

Display masked API key.

```bash
claude-usage config show
```

### config remove-key

Remove API key from Keychain.

```bash
claude-usage config remove-key
```

### usage

Retrieve usage report with token counts.

```bash
claude-usage usage
claude-usage usage --period 30d --model claude-opus-4
claude-usage usage --from 2025-01-01 --to 2025-01-31 --json
claude-usage usage --api-keys apikey_xxx --group-by model,api_key_id
```

Options: `--from`, `--to`, `--period` (7d/30d/90d), `--model`, `--api-keys`, `--group-by`, `--bucket` (1d/1h/1m), `--json`

### cost

Retrieve cost report in USD.

```bash
claude-usage cost
claude-usage cost --period 30d --group-by workspace_id,description
claude-usage cost --sum
claude-usage cost --json
```

Options: `--from`, `--to`, `--period`, `--group-by`, `--sum` (output total only), `--json`

#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
archive="$project_dir/public/leaaid-agent-package.zip"

rm -f "$archive"
cd "$project_dir"
zip -j -9 "$archive" \
  agent-package/README.md \
  agent-package/SYSTEM_INSTRUCTIONS.md \
  agent-package/agent-package.json \
  public/LEAAID-COHORT-PATHWAY-SETUP.md \
  public/leaaid-cohort-pathway-agent.json \
  public/leaaid-operating-harness.json \
  public/openapi.json \
  public/client-kits/gemini-function-tool.json \
  public/client-kits/gemini-function-executor.mjs \
  public/slack-app-manifest.json \
  public/client-kits/harness-runner.mjs

printf '%s\n' "$archive"

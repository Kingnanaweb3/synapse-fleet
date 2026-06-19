#!/usr/bin/env bash
set -e
if [ -n "$AGENT_CONFIG_YAML" ]; then
  printf '%s' "$AGENT_CONFIG_YAML" > agent_config.yaml
fi
export UI_EVENT_URL="http://localhost:${PORT:-8888}/api/event"
uv run python main.py &
uv run python ui/server.py

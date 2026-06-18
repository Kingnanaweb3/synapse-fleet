#!/bin/bash
REGULATION=${1:-GDPR}
source .env

LAWFEED_ID="bda6a473-493e-4753-816a-fbae53e72163"
BOARD_ID="a4bcc095-e06d-4f2f-b1b5-0762fea07eee"

# Use Board Notifier's key to send message mentioning LawFeed
BOARD_KEY=$(python3 -c "import yaml; c=yaml.safe_load(open('agent_config.yaml')); print(c['board_notifier']['api_key'])")

curl -s -X POST "https://app.band.ai/api/v1/agent/chats/${BAND_ROOM_ID}/messages" \
  -H "X-API-Key: ${BOARD_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"message\": {\"content\": \"@[[${LAWFEED_ID}]] analyze ${REGULATION}\", \"mentions\": [{\"id\": \"${LAWFEED_ID}\"}]}}"

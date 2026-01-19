#!/bin/bash

# Test script for /api/chat-title endpoint
# Usage: ./test-chat-title-api.sh

echo "Testing /api/chat-title endpoint..."
echo ""

curl -X POST http://localhost:3002/api/chat-title \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "tell me about preferences"
      },
      {
        "role": "assistant",
        "content": "Preferences in Knock allow you to manage user notification preferences..."
      }
    ]
  }' \
  -w "\n\nHTTP Status: %{http_code}\n" \
  -v

echo ""
echo "Test complete!"

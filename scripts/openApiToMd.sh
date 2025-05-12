#!/bin/bash

# Convert OpenAPI spec to markdown
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
openapi-to-md "$SCRIPT_DIR/../data/specs/api/openapi.yml" "$SCRIPT_DIR/../public/api-reference-openapi.md"
openapi-to-md "$SCRIPT_DIR/../data/specs/mapi/openapi.yml" "$SCRIPT_DIR/../public/mapi-reference-openapi.md"

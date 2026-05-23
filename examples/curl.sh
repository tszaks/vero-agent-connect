#!/usr/bin/env bash
set -euo pipefail

: "${VERO_API_TOKEN:?Set VERO_API_TOKEN first}"
VERO_API_BASE_URL="${VERO_API_BASE_URL:-https://api.askvero.app/functions/v1/vero-api/v1}"

curl "$VERO_API_BASE_URL/financial-data?transaction_limit=100&transaction_offset=0" \
  -H "Authorization: Bearer $VERO_API_TOKEN" \
  -H "Content-Type: application/json"

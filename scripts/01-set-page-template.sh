#!/usr/bin/env bash
# =============================================================================
# 01 - Set Universal Login Page Template
# =============================================================================
# Sets a custom Liquid template for the New Universal Login page.
# This gives us full control over the HTML wrapper around the Auth0 login widget,
# including custom branding, fonts, and JavaScript.
#
# The template includes:
# - Fuel Rewards branded header (dark gradient, amber accent)
# - Liquid conditional: on signup screens, injects a zip code field
# - JavaScript reads ext-zipcode from the URL (forwarded by Auth0 from the
#   authorization request) and pre-fills the zip code input
# - The field uses name="ulp-zip-code" so the Pre User Registration Action
#   can read it from event.request.body
#
# API:  PUT /api/v2/branding/templates/universal-login
# Docs: https://auth0.com/docs/customize/login-pages/universal-login/customize-templates
# Scope: update:branding
# =============================================================================

set -euo pipefail

AUTH0_DOMAIN="${AUTH0_DOMAIN:?Set AUTH0_DOMAIN env var}"
AUTH0_TOKEN="${AUTH0_TOKEN:?Set AUTH0_TOKEN env var}"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TEMPLATE_FILE="${SCRIPT_DIR}/../auth0/page-template.liquid"

if [ ! -f "$TEMPLATE_FILE" ]; then
  echo "ERROR: Template file not found at ${TEMPLATE_FILE}"
  exit 1
fi

TEMPLATE=$(cat "$TEMPLATE_FILE")

echo "Setting Universal Login page template..."
echo "  Source: ${TEMPLATE_FILE}"
echo "  Size:  $(echo "$TEMPLATE" | wc -c | tr -d ' ') bytes"
echo ""

HTTP_CODE=$(curl --silent --output /dev/stderr --write-out "%{http_code}" \
  --request PUT \
  --url "https://${AUTH0_DOMAIN}/api/v2/branding/templates/universal-login" \
  --header "authorization: Bearer ${AUTH0_TOKEN}" \
  --header "content-type: application/json" \
  --data "$(jq -n --arg template "$TEMPLATE" '{ template: $template }')" \
  2>&1)

echo ""
if [ "$HTTP_CODE" -eq 201 ] || [ "$HTTP_CODE" -eq 200 ] || [ "$HTTP_CODE" -eq 204 ]; then
  echo "SUCCESS: Page template set (HTTP ${HTTP_CODE})"
else
  echo "FAILED: HTTP ${HTTP_CODE}"
  exit 1
fi

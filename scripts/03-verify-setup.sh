#!/usr/bin/env bash
# =============================================================================
# 03 - Verify Auth0 Configuration
# =============================================================================
# Reads back the page template and action bindings to confirm setup.
#
# APIs: GET /api/v2/branding/templates/universal-login
#       GET /api/v2/actions/triggers/pre-user-registration/bindings
# Scopes: read:branding, read:actions
# =============================================================================

set -euo pipefail

AUTH0_DOMAIN="${AUTH0_DOMAIN:?Set AUTH0_DOMAIN env var}"
AUTH0_TOKEN="${AUTH0_TOKEN:?Set AUTH0_TOKEN env var}"

echo "========================================="
echo "1. Universal Login Page Template"
echo "========================================="
echo ""

TEMPLATE_RESPONSE=$(curl --silent \
  --request GET \
  --url "https://${AUTH0_DOMAIN}/api/v2/branding/templates/universal-login" \
  --header "authorization: Bearer ${AUTH0_TOKEN}" \
  --header "content-type: application/json")

# Show key details
echo "$TEMPLATE_RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    body = data.get('body', '')
    print(f'Template length: {len(body)} chars')
    print(f'Has auth0:head: {\"auth0:head\" in body}')
    print(f'Has auth0:widget: {\"auth0:widget\" in body}')
    print(f'Has FUEL REWARDS branding: {\"FUEL\" in body and \"REWARDS\" in body}')
    print(f'Has zip code injection: {\"ulp-zip-code\" in body}')
    print(f'Has Liquid prompt conditional: {\"prompt.name\" in body}')
    print()
    print('--- First 200 chars ---')
    print(body[:200])
except:
    print(sys.stdin.read())
"

echo ""
echo "========================================="
echo "2. Pre User Registration Action Bindings"
echo "========================================="
echo ""

curl --silent \
  --url "https://${AUTH0_DOMAIN}/api/v2/actions/triggers/pre-user-registration/bindings" \
  --header "authorization: Bearer ${AUTH0_TOKEN}" \
  | python3 -c "
import sys, json
data = json.load(sys.stdin)
bindings = data.get('bindings', [])
print(f'Total bindings: {len(bindings)}')
for i, b in enumerate(bindings):
    name = b.get('display_name', 'unknown')
    action_id = b.get('action', {}).get('id', 'unknown')
    print(f'  [{i+1}] {name} (id: {action_id})')
"

echo ""
echo "========================================="
echo "Verification complete."
echo "========================================="

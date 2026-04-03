#!/usr/bin/env bash
# =============================================================================
# 04 - Create & Deploy Pre User Registration Action
# =============================================================================
# Creates an Auth0 Action that captures the zip code from the signup form
# and stores it in user_metadata. Then deploys it and binds it to the
# pre-user-registration trigger.
#
# APIs: POST /api/v2/actions/actions         (create)
#       POST /api/v2/actions/actions/{id}/deploy  (deploy)
#       PATCH /api/v2/actions/triggers/pre-user-registration/bindings (bind)
# Scopes: create:actions, update:actions, update:triggers
# =============================================================================

set -euo pipefail

AUTH0_DOMAIN="${AUTH0_DOMAIN:?Set AUTH0_DOMAIN env var}"
AUTH0_TOKEN="${AUTH0_TOKEN:?Set AUTH0_TOKEN env var}"

ACTION_NAME="Fuel Rewards - Store Zip Code"

# Write the action payload to a temp file (avoids shell escaping issues)
cat > /tmp/action-payload.json << 'JSONEOF'
{
  "name": "Fuel Rewards - Store Zip Code",
  "supported_triggers": [{"id": "pre-user-registration", "version": "v2"}],
  "code": "exports.onExecutePreUserRegistration = async (event, api) => {\n  const zipCode = event.request.body?.[\"ulp-zip-code\"];\n  if (zipCode && /^\\d{5}$/.test(zipCode)) {\n    api.user.setUserMetadata(\"zip_code\", zipCode);\n  }\n};"
}
JSONEOF

echo "=== Step 1: Create Action ==="
RESULT=$(curl --silent \
  --request POST \
  --url "https://${AUTH0_DOMAIN}/api/v2/actions/actions" \
  --header "authorization: Bearer ${AUTH0_TOKEN}" \
  --header "content-type: application/json" \
  --data @/tmp/action-payload.json)

ACTION_ID=$(echo "$RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('id',''))" 2>/dev/null)

if [ -z "$ACTION_ID" ]; then
  echo "Action may already exist. Searching..."
  ACTION_ID=$(curl --silent \
    --url "https://${AUTH0_DOMAIN}/api/v2/actions/actions?triggerId=pre-user-registration" \
    --header "authorization: Bearer ${AUTH0_TOKEN}" \
    | python3 -c "
import sys, json
data = json.load(sys.stdin)
for a in data.get('actions', []):
    if a['name'] == '${ACTION_NAME}':
        print(a['id'])
        break
" 2>/dev/null)
fi

echo "Action ID: ${ACTION_ID}"

echo ""
echo "=== Step 2: Deploy Action ==="
curl --silent --write-out "\nHTTP %{http_code}\n" \
  --request POST \
  --url "https://${AUTH0_DOMAIN}/api/v2/actions/actions/${ACTION_ID}/deploy" \
  --header "authorization: Bearer ${AUTH0_TOKEN}" \
  --header "content-type: application/json" > /dev/null

echo "Deployed."

echo ""
echo "=== Step 3: Bind to pre-user-registration trigger ==="
# Get existing bindings, build new list, append ours
python3 -c "
import json, subprocess, sys

result = subprocess.run([
    'curl', '--silent',
    '--url', 'https://${AUTH0_DOMAIN}/api/v2/actions/triggers/pre-user-registration/bindings',
    '--header', 'authorization: Bearer ${AUTH0_TOKEN}'
], capture_output=True, text=True)

data = json.loads(result.stdout)
bindings = []
already_bound = False

for b in data.get('bindings', []):
    bindings.append({'ref': {'type': 'action_id', 'value': b['action']['id']}, 'display_name': b['display_name']})
    if b['action']['id'] == '${ACTION_ID}':
        already_bound = True

if already_bound:
    print('Action already bound to trigger.')
    sys.exit(0)

bindings.append({'ref': {'type': 'action_id', 'value': '${ACTION_ID}'}, 'display_name': '${ACTION_NAME}'})

with open('/tmp/bindings-patch.json', 'w') as f:
    json.dump({'bindings': bindings}, f)
print(f'Binding {len(bindings)} actions to trigger...')
"

if [ -f /tmp/bindings-patch.json ]; then
  curl --silent --write-out "\nHTTP %{http_code}\n" \
    --request PATCH \
    --url "https://${AUTH0_DOMAIN}/api/v2/actions/triggers/pre-user-registration/bindings" \
    --header "authorization: Bearer ${AUTH0_TOKEN}" \
    --header "content-type: application/json" \
    --data @/tmp/bindings-patch.json > /dev/null
  echo "Bound."
fi

echo ""
echo "SUCCESS: Action created, deployed, and bound to pre-user-registration trigger."

# Cleanup
rm -f /tmp/action-payload.json /tmp/bindings-patch.json

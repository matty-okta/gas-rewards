#!/usr/bin/env bash
# =============================================================================
# 02 - Set Signup Form Partial (Zip Code Field)
# =============================================================================
# Adds a zip code input field to the signup form using the "form-content-end"
# insertion point. The field uses the "ulp-" prefix so Auth0 Actions can read it.
#
# The zip code is pre-filled via JavaScript that reads the "ext-zipcode" param
# from the authorization URL. Auth0 forwards any "ext-" prefixed authorization
# params as query parameters on the Universal Login page.
#
# API:  PUT /api/v2/prompts/signup/partials
# Docs: https://auth0.com/docs/customize/login-pages/universal-login/customize-signup-and-login-prompts
# Scope: update:prompts
# =============================================================================

set -euo pipefail

AUTH0_DOMAIN="${AUTH0_DOMAIN:?Set AUTH0_DOMAIN env var}"
AUTH0_TOKEN="${AUTH0_TOKEN:?Set AUTH0_TOKEN env var}"

# Partial HTML - inserted at form-content-end on the signup screen
# Uses ulp- prefix so the value is available in Actions via event.request.body
PARTIAL_HTML='<div class="ulp-field" style="margin-top: 12px;">
  <label for="ulp-zip-code" style="display:block; margin-bottom:4px; font-size:14px; color:#65758b;">
    Zip Code
  </label>
  <input
    type="text"
    id="ulp-zip-code"
    name="ulp-zip-code"
    inputmode="numeric"
    pattern="\\d{5}"
    maxlength="5"
    placeholder="Enter your zip code"
    style="width:100%; padding:10px 12px; border:1px solid #d0d5dd; border-radius:8px; font-size:16px; box-sizing:border-box;"
  />
</div>
<script>
  (function() {
    try {
      var params = new URLSearchParams(window.location.search);
      var zip = params.get("ext-zipcode");
      if (zip) {
        var el = document.getElementById("ulp-zip-code");
        if (el) { el.value = zip; }
      }
    } catch(e) {}
  })();
</script>'

# The API expects a JSON body mapping insertion points to HTML strings
# For signup, we target "signup" prompt with "form-content-end" insertion point
BODY=$(jq -n --arg html "$PARTIAL_HTML" '{
  "form-content-end": $html
}')

echo "Setting signup partial (zip code field at form-content-end)..."
echo ""

HTTP_CODE=$(curl --silent --output /dev/stderr --write-out "%{http_code}" \
  --request PUT \
  --url "https://${AUTH0_DOMAIN}/api/v2/prompts/signup/partials" \
  --header "authorization: Bearer ${AUTH0_TOKEN}" \
  --header "content-type: application/json" \
  --data "$BODY" \
  2>&1)

echo ""
if [ "$HTTP_CODE" -eq 200 ] || [ "$HTTP_CODE" -eq 201 ] || [ "$HTTP_CODE" -eq 204 ]; then
  echo "SUCCESS: Signup partial set (HTTP ${HTTP_CODE})"
else
  echo "FAILED: HTTP ${HTTP_CODE}"
  exit 1
fi

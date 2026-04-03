# Auth0 Management API Scripts

These scripts configure the Auth0 tenant for the Fuel Rewards loyalty app.
Run them in order when setting up a new tenant.

## Prerequisites

1. Get a Management API access token from your Auth0 Dashboard:
   **Applications → APIs → Auth0 Management API → API Explorer tab → Create & Authorize a Test Application**

   Or use the token endpoint:
   ```bash
   curl --request POST \
     --url 'https://pdi-rewards.oktademo.site/oauth/token' \
     --header 'content-type: application/json' \
     --data '{
       "client_id": "<M2M_CLIENT_ID>",
       "client_secret": "<M2M_CLIENT_SECRET>",
       "audience": "https://pdi-rewards.cic-demo-platform.auth0app.com/api/v2/",
       "grant_type": "client_credentials"
     }'
   ```

2. Export it:
   ```bash
   export AUTH0_TOKEN="your_management_api_token"
   export AUTH0_DOMAIN="pdi-rewards.cic-demo-platform.auth0app.com"
   ```

## Scripts (run in order)

| # | Script | Purpose |
|---|--------|---------|
| 1 | `01-set-page-template.sh` | Sets the branded Universal Login page template (Liquid) with zip code field injection |
| 2 | `02-set-signup-partial.sh` | (Legacy - partials approach) Adds zip code field via partials API |
| 3 | `03-verify-setup.sh` | Reads back the template and action bindings to confirm |
| 4 | `04-create-action.sh` | Creates, deploys, and binds the Pre User Registration Action |

## How the Zip Code Flow Works

1. **App → Auth0:** The "Get Started" button links to `/auth/login?screen_hint=signup&ext-zipcode=77002`
2. **Auth0 page template (Liquid):** The template uses `{% if prompt.name == "signup" %}` to conditionally inject JavaScript only on signup screens
3. **JavaScript injection:** The script reads `ext-zipcode` from the URL query params (Auth0 forwards `ext-` prefixed authorization params), creates a `<input name="ulp-zip-code">` field, and injects it into the signup form using DOM manipulation. A `MutationObserver` ensures the field is added even if the widget renders asynchronously.
4. **Pre User Registration Action:** Reads `event.request.body['ulp-zip-code']` and calls `api.user.setUserMetadata('zip_code', value)` to persist it
5. **Post-login:** The app reads `user_metadata.zip_code` to determine loyalty tier

## Architecture: Why Page Templates (not Partials)

The zip code field is injected via the **page template** (`PUT /api/v2/branding/templates/universal-login`) rather than **partials** (`PUT /api/v2/prompts/{prompt}/partials`). The page template approach gives us:
- Full control over the HTML page wrapper via Liquid syntax
- Conditional rendering using Liquid variables like `prompt.name` and `prompt.screen.name`
- Ability to run custom JavaScript that reads URL parameters and manipulates the widget DOM
- The `{%- auth0:widget -%}` tag renders the standard Auth0 login/signup widget inside our custom wrapper

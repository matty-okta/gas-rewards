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
| 1 | `01-set-page-template.sh` | Sets the branded Universal Login page template (split layout, Geist font, hero image, zip code injection) |
| 2 | `02-set-signup-partial.sh` | (Legacy - partials approach) Adds zip code field via partials API. Not needed if using the page template approach. |
| 3 | `03-verify-setup.sh` | Reads back the template and action bindings to confirm everything is deployed |
| 4 | `04-create-action.sh` | Creates, deploys, and binds the Pre User Registration Action |

## Page Template Layout

The page template (`auth0/page-template.liquid`) uses a split-panel design:

- **Desktop (≥768px wide, ≥720px tall):** Hero image fills the left half, login widget on the right. Logo in the top-left, footer at bottom-right.
- **Mobile:** Widget only, full-width. Logo hidden on very short screens.

Key features:
- **Font:** Geist (loaded from Google Fonts) — matches the Next.js app
- **Hero image:** `public/hero-gas-station.png` hosted on GitHub, referenced via raw.githubusercontent.com
- **Logo:** `public/logo.svg` hosted on GitHub
- **CSS variables:** Control border-radius, primary color (#f59e0b amber), form element sizing
- **Organization branding:** If an Auth0 Organization has `hero_image`, `logo_url`, or `linear_gradient` in its metadata, those override the defaults
- **Zip code field:** Injected via JavaScript on signup screens only (Liquid conditional on `prompt.name`)

## How the Zip Code Flow Works

1. **App → Auth0:** The "Get Started" button links to `/auth/login?screen_hint=signup&ext-zipcode=XXXXX`
2. **Auth0 page template (Liquid):** The template uses `{% if prompt.name == "signup" %}` to conditionally run JavaScript only on signup screens
3. **Liquid server-side injection:** The zip code value comes from `{{ transaction.params.ext-zipcode }}` — Auth0 forwards `ext-` prefixed authorization params into the Liquid `transaction` context (NOT as URL query params on the rendered page)
4. **JavaScript DOM injection:** A `MutationObserver` waits for the Auth0 widget to render, then injects a `<input name="ulp-zip-code">` field before the submit button. The field is pre-filled with the Liquid-injected zip value.
5. **Pre User Registration Action:** Reads `event.request.body['ulp-zip-code']` and calls `api.user.setUserMetadata('zip_code', value)` to persist it
6. **Post-login:** The app reads `user_metadata.zip_code` to determine loyalty tier

## Architecture: Why Page Templates (not Partials)

The zip code field is injected via the **page template** (`PUT /api/v2/branding/templates/universal-login`) rather than **partials** (`PUT /api/v2/prompts/{prompt}/partials`). The page template approach gives us:
- Full control over the HTML page wrapper via Liquid syntax
- Split-panel layout with hero image (not possible with partials alone)
- Conditional rendering using Liquid variables like `prompt.name` and `transaction.params`
- Server-side access to `ext-` authorization parameters via Liquid (more reliable than URL parsing)
- Ability to run custom JavaScript that manipulates the widget DOM
- The `{%- auth0:widget -%}` tag renders the standard Auth0 login/signup widget inside our custom wrapper
- Organization-level branding overrides via metadata

## Redeploying After Changes

If you edit `auth0/page-template.liquid`, redeploy it with:

```bash
export AUTH0_TOKEN="your_token"
export AUTH0_DOMAIN="pdi-rewards.cic-demo-platform.auth0app.com"
./scripts/01-set-page-template.sh
./scripts/03-verify-setup.sh   # confirm it took
```

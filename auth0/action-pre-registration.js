/**
 * Auth0 Action: Pre User Registration
 *
 * Trigger: Pre User Registration
 * Purpose: Reads the zip code submitted via the signup form (ulp-zip-code)
 *          and stores it in user_metadata so it's available after login.
 *
 * Setup:
 * 1. Go to Auth0 Dashboard → Actions → Flows → Pre User Registration
 * 2. Create a new Action with this code
 * 3. Deploy and drag it into the flow
 */
exports.onExecutePreUserRegistration = async (event, api) => {
  const zipCode = event.request.body?.["ulp-zip-code"];

  if (zipCode && /^\d{5}$/.test(zipCode)) {
    api.user.setUserMetadata("zip_code", zipCode);
  }
};

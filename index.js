const customerResource = require('./resources/r_customer.js');
const customerTrigger = require('./triggers/t_updating_customer.js');
const auth = require('./authentication/session_authen.js');
const customerCreates = require('./creates/c_customer.js');

// Now we can roll up all our behaviors in an App.
const App = {
  // This is just shorthand to reference the installed dependencies you have.
  // Zapier will need to know these before we can upload

  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  authentication: auth.authentication,
  beforeRequest: [auth.addingAccessToken],
  afterResponse: [auth.responseProcessing],

  resources: {
    [customerResource.key]: customerResource,
  },

  // If you want your trigger to show up, you better include it here!
  triggers: {
    [customerTrigger.key]: customerTrigger,
  },

  // If you want your searches to show up, you better include it here!
  searches: {},

  // If you want your creates to show up, you better include it here!
  creates: {
    [customerCreates.key]: customerCreates,
  },
};

// Finally, export the app.
module.exports = App;

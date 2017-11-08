const { domain, clientID, clientSecret } = require('./config');
const Auth0Strategy = require('passport-auth0');


module.exports = new Auth0Strategy(
  {
    domain,
    clientID,
    clientSecret,
    callbackURL:  '/login'
  },

  function(accessToken, refreshToken, extraParams, profile, done) {
    console.log("profile: ", profile);
    return done(null, profile);
  }
);


const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const {isUserInDatabase, addUserToDatabase} = require('./dbfunctions');
// GOOGLE_CLIENT_ID is a public identifier assigned to your application when you register it with the OAuth provider.
//Client Secret is a confidential, private key that is known only to your application and the OAuth provider.
const GOOGLE_CLIENT_ID = '384763978609-0hpts0nscack9a30ecgakf5no4qmh6rs.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/google/callback",
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, done) {
    return done(null,profile);
  }));
    


passport.serializeUser(function(user,done){//takes a user object and stores it in a session
    done(null, user);
});


passport.deserializeUser(function(user,done){
    done(null, user);
});

module.exports = passport;
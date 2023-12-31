
const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const {isUserInDatabase, addUserToDatabase} = require('./dbfunctions');
// GOOGLE_CLIENT_ID is a public identifier assigned to your application when you register it with the OAuth provider.
//Client Secret is a confidential, private key that is known only to your application and the OAuth provider.

const GOOGLE_CLIENT_ID = '384763978609-0hpts0nscack9a30ecgakf5no4qmh6rs.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

// const GOOGLE_CLIENT_ID = '568807341325-8o01v2gqg9jjt2ebi6n9ddk1s8095nem.apps.googleusercontent.com';
// const GOOGLE_CLIENT_SECRET = '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';

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://studentsphere.ignorelist.com/google/callback",
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
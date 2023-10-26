
const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

const GOOGLE_CLIENT_ID = '384763978609-0hpts0nscack9a30ecgakf5no4qmh6rs.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/google/callback",
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, done) {
    // if (err) {
    //     return done(err); // Handle the error here
    // }
    // Handle successful authentication here
    return done(null, profile);
  }
));


passport.serializeUser(function(user,done){
    done(null, user);
});


passport.deserializeUser(function(user,done){
    done(null, user);
});

module.exports = passport;
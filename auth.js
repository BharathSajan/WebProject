
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
    const userEmail = profile.email;
    const userName = profile.name['givenName'] +" "+ profile.name['familyName'];
    // console.log(typeof userNm);
    // console.log(userEmail,userName);
    const user = {name: userName, email: userEmail};
    addUserToDatabase(user, function (err) {
        if (err) {
          console.log(err);
          return done(err); // Handle database insertion error
        }
        // Redirect to the desired page after inserting the user
        console.log("Success");
        return done(null, profile,{redirectTo:'/studentspage'}); 
      }); 
    // return done(null,profile);
    // isUserInDatabase(userEmail, function (err, userExists) {
    //   if (err) {
    //     return done(err); // Handle database error
    //   }
  
    //   if (userExists) {
    //     // User is in the database, store user data in session
    //     return done(null, profile);
    //   } else {
    //     // User is not in the database, insert the user and then redirect
    //     const user = {
    //       name: profile.name,
    //       email: profile.email
    //     };
        
        // addUserToDatabase(user, function (err) {
        //   if (err) {
        //     return done(err); // Handle database insertion error
        //   }
  
        //   // Redirect to the desired page after inserting the user
        //   return done(null, false,{redirectTo:'/studentspage'});
        // });
    //   }
    // });
  }));
    


passport.serializeUser(function(user,done){//takes a user object and stores it in a session
    done(null, user);
});


passport.deserializeUser(function(user,done){// retrieves user data from the session and attaches it to the request object.
    done(null, user);
});

module.exports = passport;
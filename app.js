const express = require('express');
const session = require("express-session");
const db = require('./database'); 
const app = express();
const port = 4000;
const passport = require('./auth');
 require('./auth');
 app.use(express.static('views'));

function isLoggedIn(req,res, next){
  req.user ? next(): res.sendStatus(401);
}

app.use(session({ secret: "cats"}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    // Send the 'signinPage.html' as the response
    res.sendFile(__dirname + '/signInPage.html');
  });

app.get('/auth/google',//this page is the portal for google
  passport.authenticate('google', { scope: ['email','profile']})//scope refers to the application permissions we are requesting for from the user's google account.Here we ask for user's email and basic profile information.
) 
app.get('/google/callback',//this page handles the result of the authentication at the google portal
  passport.authenticate('google',{
    successRedirect: '/landing',
    failureRedirect: '/auth/failure',
}));

app.get('/auth/failure',(req,res)=>{
res.send('something went wrong. .');
});

app.get('/studentspage',isLoggedIn,(req, res)=>{
  res.sendFile(__dirname + '/studentsPage.html')
});
app.get('/landing',isLoggedIn,(req, res)=>{
  res.sendFile(__dirname + '/studentChannelPage.html')
});

app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      // Handle any potential errors here
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        // Handle any potential errors here
        return next(err);
      }
      res.send('Goodbye!');
    });
  });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
  });


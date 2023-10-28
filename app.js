const express = require('express');
const session = require("express-session");
const db = require('./database'); 
const app = express();
const port = 4000;
const passport = require('./auth');
 require('./auth');

 app.use(session({
   secret: "cats",
  resave: false,
saveUninitialized:false,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('views'));

//database utilities
const {isUserInDatabase, addUserToDatabase} = require('./dbfunctions');

function isLoggedIn(req,res, next){
  // console.log(req.user);
  req.user ? next(): res.sendStatus(401);
}



app.get('/', (req, res) => {
    // Send the 'signinPage.html' as the response
    res.sendFile(__dirname + '/signInPage.html');
  });

app.get('/auth/google',//this page is the portal for google
  passport.authenticate('google', { scope: ['email','profile']})//scope refers to the application permissions we are requesting for from the user's google account.Here we ask for user's email and basic profile information.
) 

app.get('/google/callback',//this page handles the result of the authentication at the google portal
  passport.authenticate('google',{
    
    successRedirect: '/studentspage',
    failureRedirect: '/auth/failure',
}));

app.get('/auth/failure',(req,res)=>{
res.send('something went wrong. .');
});

app.get('/studentspage', isLoggedIn, (req, res) => {
  // Gather details of the user
  const userEmail = req.user.email;
  const userName = req.user.name['givenName'] + ' ' + req.user.name['familyName'];
  const user = { name: userName, email: userEmail };

  isUserInDatabase(userEmail, function (err, userExists) {
    if (err) {
      res.sendStatus(500); // Handle database error
    } else if (userExists) {
      // User is in the database, redirect to '/landing'
      res.redirect('/landing');
    } else {
      // User is not in the database, add them to the database
      addUserToDatabase(user, function (err) {
        if (err) {
          console.log(err);
          res.sendStatus(500); // Handle database insertion error
        } else {
          // User added to the database, send the studentsPage.html
          res.sendFile(__dirname + '/studentsPage.html');
        }
      });
    }
  });
});

app.get('/landing',isLoggedIn,(req, res)=>{
  res.sendFile(__dirname + '/studentChannelPage.html')
});

app.get('/myChannels',isLoggedIn,(req, res)=>{
  res.sendFile(__dirname + '/myChannelPage.html')
});

app.get('/createChannel',isLoggedIn,(req, res)=>{
  res.sendFile(__dirname + '/createChannel.html')
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


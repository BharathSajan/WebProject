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

app.get('/auth/google',
  passport.authenticate('google', { scope: ['email','profile']})
) 
app.get('/google/callback',
  passport.authenticate('google',{
    successRedirect: '/studentspage',
    failureRedirect: '/auth/failure',
}));

app.get('/auth/failure',(req,res)=>{
res.send('something went wrong. .');
});

app.get('/studentspage',isLoggedIn,(req, res)=>{
  res.sendFile(__dirname + '/studentsPage.html')
});

app.get('/myChannels',isLoggedIn,(req, res)=>{
  res.sendFile(__dirname + '/myChannelPage.html')
});

app.get('/createChannel',isLoggedIn,(req, res)=>{
  res.sendFile(__dirname + '/createChannel.html')
});
app.get('/channels',isLoggedIn,(req, res)=>{
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


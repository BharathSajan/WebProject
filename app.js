const express = require('express');
const session = require("express-session");
const db = require('./database'); 
const app = express();
const port = 4000;
const passport = require('./auth');
 require('./auth');


 const path = require('path');

 const adminEmail = "clint_b200705cs@nitc.ac.in";
//  const adminEmail = "anand_b200763cs@nitc.ac.in";
 

 const {isAdmin,getReportedCount,adminSearchCommunity,deleteTag,searchCommunity,insertChannel,delCommunity,delReported,getReported,viewChannel,getuid,getinterestedCommunities, insertCommunityTags,insertUserTags,myCommunities,insertReported,getAllChannels} = require('./dbfunctions')

 const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));


 app.use(session({
   secret: "cats",
  resave: false,
saveUninitialized:false,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));
app.set('view engine','ejs');


app.set('views', path.join(__dirname, 'views'));

//database utilities
const {isUserInDatabase, addUserToDatabase} = require('./dbfunctions');

function isLoggedIn(req,res, next){
  // console.log(req.user);
  req.user ? next(): res.sendStatus(401);
}



app.get('/', (req, res) => {
    res.render('signInPage');
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

  if (userEmail === adminEmail) {
    // Admin user
    //console.log("Admin user: True");
    res.redirect('/AdminPage');
  } else {
    // Non-admin user
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
            res.render('studentsPage', { data: userName });
          }
        });
      }
    });
  }
});


app.get('/landing',isLoggedIn,(req, res)=>{
  const userName = req.user.name['givenName'] + ' ' + req.user.name['familyName'];
  const userEmail = req.user.email;
  if (userEmail === adminEmail) {//Admin
    // Admin user
    //console.log("Admin user: True");
    res.redirect('/AdminPage');
  } else {
  getuid(userEmail, (err,row)=>{
    if(err){
      console.log(err);
    }
    else{
      getinterestedCommunities(row[0]['id'], (errs, result)=>{
        if(errs){
          console.log(errs);
        }
        else{
          console.log(result);
          res.render('studentChannelPage',{result: result, name:userName});
        }
      });
      }
  });

  } 
});



app.get('/myChannels',isLoggedIn,(req, res)=>{
  const userName = req.user.name['givenName'] + ' ' + req.user.name['familyName'];
  const userEmail = req.user.email;
  if (userEmail === adminEmail) {//Admin
    res.redirect('/AdminPage');
  }
  else{
  getuid(userEmail, (err,row)=>{
    if(err){
      console.log(err);
    }
    else{
      myCommunities(row[0]['id'], (errs, result)=>{
        if(errs){
          console.log(errs);
        }
        else{
          res.render('myChannelPage',{result: result, name:userName});
        }
      });
      }
  });
}
  });

app.get('/reportChannel/:id',isLoggedIn,(req, res)=>{
  const Channel_id = req.params.id;
  const userEmail = req.user.email;
  getuid(userEmail, (err,row)=>{
    if(err){
      console.log(err);
    }
    else{
      insertReported(row[0]['id'],Channel_id, (err)=>{
        if(err){
          console.log(err);
        }
        else{
          console.log("redirecting to landing")
          res.redirect('/landing');
        }
      });
      }
  });

  });
  
  

app.get('/myChannels/:id',(req, res)=>{
  const userName = req.user.name['givenName'] + ' ' + req.user.name['familyName'];
  const id = req.params.id;
  // const userEmail = req.user.email;
  const userEmail = '28clintjoseph@gmail.com';
  if (userEmail === adminEmail) {//Admin
    // Admin user
    //console.log("Admin user: True");
    res.redirect('/AdminPage');
  }
  else{
  console.log("debug rpint")
  viewChannel(id, (err,row)=>{
    if(err){
      console.log(err);
    }
    else{
      res.render('singleChannel',{row: row, name:userName});
    }
  });
}
});



app.get('/createChannel',isLoggedIn,(req, res)=>{
  const userName = req.user.name['givenName'] + ' ' + req.user.name['familyName'];
  res.render('createChannel',{name:userName});
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
      setTimeout(() => {
        // After the delay, perform the redirect
        res.redirect('/');
      }, 2000);
    });
  });
});



app.post('/submit_first', (req, res) => {
  const { interests } = req.body; // This will contain an array of selected interests
  const userEmail = req.user.email;
  const tagArray = interests.map(JSON.parse); // Convert each element to a JavaScript object
  for (let i = 0; i < tagArray.length; i++) {
    const tag = tagArray[i];
    if (typeof tag === 'number') {
      getuid(userEmail, (err,row)=>{
        if(err){
          console.log(err);
        }
        else{
          insertUserTags(row[0]['id'],tag);
          }
      });
    } else {
      console.log("Not a number: " + tag);
    }
  }

    res.redirect('/landing');
  
});




app.post('/submit', (req, res) => {
  // Process the form data as needed
  const { channelName, channelLink, description, status, phoneNum, tags } = req.body;
  const userEmail = req.user.email;
  const profDp = req.file;
  const tagArray = tags.map(JSON.parse); 
  
  getuid(userEmail, (err,row)=>{
    if(err){
      console.log(err);
    }
    else{
      console.log(row);
      insertChannel(row[0]['id'],channelName,status,description,channelLink,phoneNum, (err,lastid)=>{
        if(err){
          console.log(err);
        }else{
          console.log("debug print");
          for(let i=0;i<tagArray.length;i++){
            const tag = tagArray[i];
            if(typeof tag === 'number'){
              console.log(tag);
              insertCommunityTags(lastid,tag);
            }
          }
        }
      });
    }
  });
  res.redirect('/landing'); // Replace '/success' with the URL of the page you want to redirect to
});

app.post('/searchSubmit',(req,res)=>{
  const userName = req.user.name['givenName'] + ' ' + req.user.name['familyName'];
  const {searchForm} = req.body;
  searchCommunity(searchForm, (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      console.log(result);
      
      res.render('studentChannelPage',{result:result , name : userName});
    }
  });
});

app.post('/AdminsearchSubmit',(req,res)=>{
  const {AdSearchForm} = req.body;
  adminSearchCommunity(AdSearchForm, (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      console.log(result);
      getReportedCount((err,count)=>{
        if(err){
          console.log(err);
        }
        else{
          console.log(count);
          res.render('AdminPage',{result:result,count: count[0]['count'] });
        }
      });
    }
  });
});


//Admin pages
app.get('/AdminPage', (req, res) => {
  // const userEmail = req.user.email;
  const userEmail = adminEmail;
  if (userEmail != adminEmail) {//Admin
    // Admin user
    //console.log("Admin user: True");
    res.redirect('/studentsPage');
  }
  else{

      getAllChannels((err,result)=>{
        if(err){
          console.log(err);
        }
        else{
          console.log(result);
          getReportedCount((err,count)=>{
            if(err){
              console.log(err);
            }
            else{
              console.log(count);
              res.render('AdminPage',{result:result,count: count[0]['count'] });
            }
          });
        }
      });



  
  }
});





// app.get('/AdReported', (req, res) => {
//   res.render('AdReportedChannelPage');
// });
// app.get('/AdSingleReported', (req, res) => {
//   res.render('AdSingleReportedChannelPage');
// });

app.get('/AdminPage/:id',isLoggedIn,(req, res)=>{
  const id = req.params.id;
  const userEmail = req.user.email;
  console.log("debug rpint")
  viewChannel(id, (err,row)=>{
    if(err){
      console.log(err);
    }
    else{
      console.log(row);
      console.log("Community created succsesfully");
      getReportedCount((err,count)=>{
        if(err){
          console.log(err);
        }
        else{
          console.log(count);
          res.render('AdSingleReportedChannelPage',{row:row,count: count[0]['count']  });
        }
      });
    }
  });
});

app.get('/reportedChannelPage',isLoggedIn, (req, res) => {
  const userEmail = req.user.email;
  if (userEmail != adminEmail) {//Admin
    // Admin user
    //console.log("Admin user: True");
    res.redirect('/studentsPage');
  }
  else{

    getReported((err,result)=>{
        if(err){
          console.log(err);
        }
        else{
          console.log(result);
          getReportedCount((err,count)=>{
            if(err){
              console.log(err);
            }
            else{
              console.log(count);
              res.render('AdReportedChannelPage',{result:result ,count: count[0]['count'] });
            }
          });
          
        }
      });
  }
});

app.get('/deleteChannel/:id',isLoggedIn, (req, res) => {
  const userEmail = req.user.email;
  const id = req.params.id;
  if (userEmail != adminEmail) {//Admin
    // Admin user
    //console.log("Admin user: True");
    res.redirect('/studentsPage');
  }
  else{
    
    delReported(id,(err)=>{
      if(err){
        console.log(err);
      }
      else{
        console.log("Deleted from reported");
      }
    });

    deleteTag(id,(err)=>{
      if(err){
        console.log(err);
      }
      else{
        console.log("Deleted from tags");
      }
    });

    delCommunity(id,(err)=>{
        if(err){
          console.log(err);
        }
        else{
          console.log("Deleted from community table");
          res.redirect('/AdminPage');
        }
      });
      
      
  }
});

app.get('/aprroveChannel/:id',isLoggedIn, (req, res) => {
  const userEmail = req.user.email;
  const id = req.params.id;
  if (userEmail != adminEmail) {//Admin
    // Admin user
    //console.log("Admin user: True");
    res.redirect('/studentsPage');
  }
  else{
      delReported(id,(err)=>{
        if(err){
          console.log(err);
        }
        else{
          console.log("Deleted from reported");
          res.redirect('/AdminPage');
        }
      });
  }
});



// Start the server
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
  });


const db = require('./database'); 


function getAllUsers(callback) {
    db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, rows);
        }
    });
}

function getAllChannels(callback) {
    db.all('SELECT * FROM community', (err, rows) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, rows);
        }
    });
}


function getuid(Email,callback){
    db.all('SELECT id from users where(email = ?)',[Email],(err, row) => {
        if (err) {
            callback(err,null);
        } else {
            
           
            callback(null, row);
            
        }
    } )
}

function getinterestedCommunities(userid,callback){
    db.all('SELECT DISTINCT community.id as Id,community.title as Title,community.create_date as Date from community,user_tags,community_tags where(user_tags.uid = ? and user_tags.tid = community_tags.tid and community_tags.cid = community.id)',userid,(err, rows) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, rows);
        }
    } )

}

function delCommunity(cid){
    db.run('delete community where id = ?'[cid] , function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("deletion from community table is succesfull");
        }
    })
}



function getReported(callback){
    db.all('select community.id,community.title,community.create_date  from reported,community where (community.id =reported.cid)' ,function(err,rows){
        if(err){
            callback(err,null);
        }
        else{
            callback(null,rows);
        }
    })
}

function insertReported(){
    db.run('INSERT INTO reported (uid,cid) VALUES (?,?)',[user,cid],function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("channel reported " +this.lastID);
        }
    })
}

function delReported(cid){
    db.run('delete reported where cid = ?'[cid] , function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("deletion from reported table is succesfull");
        }
    })
}



function searchCommunity(Term,callback){
    db.all('select distinct community.id,community.title,community.create_date from community,community_tags,tags where (community.id = community_tags.cid and community_tags.tid = tags.id and (community.title like ? or tags.name like ? ))',[`%${Term}%`,`%${Term}%`],(err,row)=>{
        if(err){
            callback(err,null);
        }
        else{
            callback(null,row);
        }
    })
}


function addUserToDatabase(user, callback) {
    // user parameter should be an object with properties like name, email, etc.
    const { name, email } = user;

    // Execute a query to insert a new user into the "users" table
    db.run('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], function (err) {
        if (err) {
            callback(err, null); // An error occurred
        } else {
            // User was successfully inserted; this.lastID contains the new user's ID
            callback(null, this.lastID);
        }
    });
}

function isUserInDatabase(email, callback) {
    // Execute a query to check if the user exists in the database
    db.get('SELECT * FROM users WHERE email = ?', email, (err, row) => {
        if (err) {
            console.log(err)// An error occurred
        } else {
            if (row) {
                // User exists in the database
                callback(null, true);
            } else {
                // User does not exist in the database
                callback(null, false);
            }
        }
    });
}

function insertChannel(aid,title,stat,description,link_url,phone,callback){
    db.run('INSERT INTO community(admin_id, title, status, description, link_url,create_date,phone) VALUES (?, ?, ?, ?, ?, ?,?)', [aid, title, stat, description, link_url,Date(),phone], function (err) {
        if (err) {
            callback(err,null); // Log the error message for debugging;
        } else {
           callback(null,this.lastID);
        }
    });
}

function insertUserTags(userid,tagid){
    db.run('INSERT INTO user_tags(uid,tid) VALUES(?,?)',[userid,tagid],function (err) {
        if (err) {
            console.error('Error:', err); // Log the error message for debugging;
        } else {
            console.log('usertags inserted successfully with ID:', this.lastID);
        }
    });

}

function insertCommunityTags(communityid,tagid){
    db.run('INSERT INTO community_tags(cid,tid) VALUES(?,?)',[communityid,tagid],function (err) {
        if (err) {
            console.error('Error:', err); // Log the error message for debugging;
        } else {
            console.log('communitytags inserted successfully with ID:', this.lastID);
        }
    });

}

function myCommunities(userid,callback){
    db.all('SELECT id,title,create_date FROM community WHERE admin_id = ? ', [userid], (err, rows) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, rows);
        }
    });
}

function viewChannel(cid,callback){
    db.all('SELECT * FROM community WHERE id = ?',[cid],(err,rows)=>{
        if (err) {
            callback(err, null);
        } else {
            callback(null, rows);
        }
    });
}



module.exports = { getuid, getAllChannels, viewChannel, isUserInDatabase, getinterestedCommunities, addUserToDatabase, insertChannel, insertCommunityTags, insertUserTags, myCommunities, insertReported, getReported, searchCommunity, delCommunity, delReported };


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

function getintrestedCommunities(userid,callback){
    db.all('SELECT community.id as Id,community.title as Title,Date as community.create_date from community,user_tags,community_tags where(user_tags.uid = ? and user_tags.tid = community_tags.tid and community_tags.cid = community.id)',userid,(err, rows) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, rows);
        }
    } )

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

module.exports = { isUserInDatabase, addUserToDatabase };

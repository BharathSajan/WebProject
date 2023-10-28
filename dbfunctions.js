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
    db.all('SELECT community.id as Id,community.title as Title from community,user_tags,community_tags where(user_tags.uid = ? and user_tags.tid = community_tags.tid and community_tags.cid = community.id)',userid,(err, rows) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, rows);
        }
    } )

}


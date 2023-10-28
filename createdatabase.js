const sqlite3 = require('sqlite3').verbose();

// Create or connect to the SQLite database
const db = new sqlite3.Database('database1.db');

// SQL code to create tables
const sqlCode = `
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT
    );

    CREATE TABLE community (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        admin_id INTEGER,
        title TEXT,
        status BOOLEAN,
        description TEXT,
        link_url TEXT,
        create_date DATE,
        FOREIGN KEY (admin_id) REFERENCES users(id)
    );

    CREATE TABLE reported (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uid INTEGER,
        cid INTEGER,
        FOREIGN KEY (uid) REFERENCES users(id),
        FOREIGN KEY (cid) REFERENCES community(id)
    );

    CREATE TABLE tags (
        id INTEGER PRIMARY KEY,
        name TEXT
    );

   
    CREATE TABLE user_tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uid INTEGER,
        tid INTEGER,
        FOREIGN KEY (uid) REFERENCES users(id),
        FOREIGN KEY (tid) REFERENCES tags(id)
    );

    CREATE TABLE community_tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cid INTEGER,
        tid INTEGER,
        FOREIGN KEY (cid) REFERENCES community(id),
        FOREIGN KEY (tid) REFERENCES tags(id)
    );
`;

// Execute the SQL code
db.serialize(() => {
    db.exec(sqlCode, function (err) {
        if (err) {
            console.error(err.message);
        } else {
            console.log('SQLite database created and tables created successfully.');
        }
    });
});

// Close the database connection
db.close();

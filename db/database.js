const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/database.db');
const bcrypt = require('bcryptjs');

// CREATE TABLES on load
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('owner', 'carer', 'admin')) NOT NULL
    );
  `, (err) => {
    if (err) {
      console.error("Failed to create 'users' table:", err.message);
    } else {
      console.log("users table found");
    }
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      pet_name TEXT NOT NULL,
      pet_age TEXT,
      description TEXT,
      services TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `, (err) => {
    if (err) {
      console.error("Failed to create 'posts' table:", err.message);
    } else {
      console.log("posts table found");
    }
  });

  db.run(`
  CREATE TABLE IF NOT EXISTS carer_jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    carer_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    FOREIGN KEY(carer_id) REFERENCES users(id),
    FOREIGN KEY(post_id) REFERENCES posts(id),
    UNIQUE(carer_id, post_id)
  )
`);
});



module.exports = db;

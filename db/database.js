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
      image_url TEXT,
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
});

// admin account auto creation
const defaultAdmin = {
  username: 'admin',
  email: 'admin@petcarer.com',
  password: 'Admin123', // must meet password rules
  role: 'admin'
};

const hashedPassword = bcrypt.hashSync(defaultAdmin.password, 10);

db.get("SELECT * FROM users WHERE username = ?", [defaultAdmin.username], (err, row) => {
  if (err) {
    console.error("Error checking for admin:", err.message);
    return;
  }

  if (!row) {
    db.run(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      [defaultAdmin.username, defaultAdmin.email, hashedPassword, defaultAdmin.role],
      (err) => {
        if (err) {
          console.error("Error creating admin account:", err.message);
        } else {
          console.log(`Default admin account created: username = ${defaultAdmin.username}, password = ${defaultAdmin.password}`);
        }
      }
    );
  } else {
    console.log("Admin account exists.");
  }
});


module.exports = db;

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database('./db/database/database.db')

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT
        username TEXT UNIQUE,
        password TEXT,
        role TEXT CHECK(role IN ('owner', 'carer', 'admin'))
        )
        `);

    db.run(`
        CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        pet_name TEXT,
        pet_age INTEGER,
        description TEXT,
        image_url TEXT,
        services TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
        )`)
})
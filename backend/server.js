const express = require('express');
const path = require('path');
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require('cors');
const { title } = require('process');


const app = express()
const port = 3000


app.use(express.json());
app.use(cors())


const dbPath = path.join(__dirname, "database", 'database.db');
app.use("/", express.static(path.join(__dirname, "../frontend")));

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error opening database:", err)
    } else {
        console.log("Connected to database");
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            email TEXT UNIQUE,
            password TEXT,
            role TEXT
            )`);
    }
})

app.get('/', (req, res) => {
    res.send("hello world")
})


app.listen(port, (error) => {
    if (error) {
        console.log("Error:", error)
    }
    console.log(`Server is running at http://127.0.0.1:${port}`)
    
})
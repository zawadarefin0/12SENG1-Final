const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const router = express.Router();
const db = require('./db/database')

const authRoutes = require('./routes/auth');
const petRoutes = require('./routes/pet');
const adminRoutes = require('./routes/admin')

const app = express()
const port = 3000

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
})

router.post('/register', (req, res) => {
    const { username, password, role } = req.body;
    const hash = bcrypt.hashSync(password, 10);
    db.run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)") [username, hash, role], err => {
        if (err) return res.status(400).json({
            error: "Username already exists"
        });
        res.json({
            message: "Registered Successfully"
        });
    }
})


app.use(session({
    secret: 'petcarer_secret',
    resave: false,
    saveUninitialized: true
}));

app.use('/auth', authRoutes);
app.use('/pets', petRoutes);
app.use('/admin', adminRoutes);

app.listen(port, (error) => {
    if (error) {
        console.log("Error:", error)
    }
    console.log(`Server is running at http://localhost:${port}`)
    
})
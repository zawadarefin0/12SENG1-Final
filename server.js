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

// Email Regex check


// Password Regex check


// Register
router.post('/register', (req, res) => {
    const { username, password, role } = req.body;
    const hash = bcrypt.hashSync(password, 10);
    db.run("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)") [username, email, hash, role], err => {
        if (err) return res.status(400).json({
            error: "Username or email already exists"
        });
        res.json({
            message: "Registered Successfully"
        });
    }
})

// Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err || !user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ error: "Invalid Credentials "})
        }
        req.session.user = { id: user.id, role: user.role };
        res.json({ message: "Logged in", role: user.role })
    })
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
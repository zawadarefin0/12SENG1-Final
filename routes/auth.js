const express = require('express')
const bcrypt = require('bcryptjs')
const db = require('../db/database')
const router = express.Router();


// Register
router.post('/register', (req, res) => {
  const { username, email, password, role } = req.body;

  // Email and password validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,20}$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format!" });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error: "Invalid password format. Must have atleast 1 uppercase, 1 number and be between 8-20 characters"
    });
  }

  const hash = bcrypt.hashSync(password, 10);

  console.log("Registering with:", username, email, role)
  db.run(
    "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
    [username, email, hash, role],
    (err) => {
      if (err) {
        console.error("SQL error:", err.message);
        return res.status(400).json({ error: "Username or email may already exist, or invalid input." });
      }
      res.json({ message: "Registered Successfully" });
    }
  );
});



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

// Check if you are logged in 
router.get('/status', (req, res) => {
  if (req.session.user) {
    db.get('SELECT username FROM users WHERE id = ?', [req.session.user.id], (err, row) => {
      if (err) return res.status(500).json({ error: "Database error" });

      res.json({
        loggedIn: true,
        user: {
          id: req.session.user.id,
          role: req.session.user.role,
          username: row?.username || "Unknown"
        }
      });
    });
  } else {
    res.json({ loggedIn: false });
  }
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy(() => res.json({ message: "Logged out" })) ;
});

module.exports = router;

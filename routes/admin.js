const express = require('express');
const db = require('../db/database')
const router = express.Router();

router.use((req, res, next) => {
    if (req.session.user?.role !== 'admin') return res.sendStatus(403);
    next();
})

// View all users
router.get('/users', (req, res) => {
    db.all("SELECT id, username, role FROM users", [], (err, users) => {
        if (err) return res.status(500).json({ error: err.message })
            res.json(users);
    })
})

// Delete a user
router.delete('/user/:id', (req, res) => {
    db.run("DELETE FROM users WHERE id = ?", [req.params.id], err => {
        if (err) return res.status(500).json({ error: err.message })
            res.json({ message: "User deleted" })
    })
})

// Delete a post
router.delete('/post/:id', (req, res) => {
    db.run('DELETE FROM posts WHERE id = ?', [req.params.id], err => {
        if (err) return res.status(500).json({ error: err.message })
            res.json({ message: "Post Deleted" })
    })
})

module.exports = router;
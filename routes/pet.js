const express = require('express');
const db = require('../db/database');
const router = express.Router();

// Pet owner adding a post
router.post('/add', (req, res) => {
    if (req.session.user?.role !== 'owner') return res.sendStatus(403)
    const { pet_name, pet_age, description, image_url, services } = req.body;
    const servicesStr = Array.isArray(services) ? services.join(',') : services;
    db.run('INSERT INTO posts (user_id, pet_name, pet_age, description, image_url, services) VALUES (?, ?, ?, ?, ?, ?)',
        [req.session.user.id, pet_name, pet_age, description, image_url, servicesStr],
        err => {
            if (err) return res.status(500).json({ error: err.message })
            res.json({ message: "Post created" })
        }
    )
})

// Viewing posts 
router.get('all', (req, res) => {
    db.all("SELECT posts.*, users.username FROM post JOIN users on posts.user_id = users.id", [], (err, posts) => {
        if (err) return res.status(500).json({ error: err.message })
            res.json(posts)
    })
})

module.exports = router;
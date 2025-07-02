const express = require('express');
const db = require('../db/database');
const router = express.Router();

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

router.post('/accept/:postId', (req, res) => {
  if (req.session.user?.role !== 'carer') return res.sendStatus(403);

  const carerId = req.session.user.id;
  const postId = req.params.postId;

  db.run(
    'INSERT OR IGNORE INTO carer_jobs (carer_id, post_id) VALUES (?, ?)',
    [carerId, postId],
    err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Job accepted" });
    }
  );
});

router.get('/mine', (req, res) => {
  if (req.session.user?.role !== 'owner') return res.sendStatus(403);

  db.all(
    `SELECT posts.* FROM posts WHERE user_id = ?`,
    [req.session.user.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

router.delete('/unaccept/:postId', (req, res) => {
  if (req.session.user?.role !== 'carer') return res.sendStatus(403);

  const carerId = req.session.user.id;
  const postId = req.params.postId;

  db.run(
    'DELETE FROM carer_jobs WHERE carer_id = ? AND post_id = ?',
    [carerId, postId],
    err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Job removed" });
    }
  );
});

router.get('/myjobs', (req, res) => {
  if (req.session.user?.role !== 'carer') return res.sendStatus(403);

  const carerId = req.session.user.id;

  db.all(
    `SELECT posts.*, users.username
     FROM posts
     JOIN users ON posts.user_id = users.id
     WHERE posts.id IN (
       SELECT post_id FROM carer_jobs WHERE carer_id = ?
     )`,
    [carerId],
    (err, jobs) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(jobs);
    }
  );
});


router.delete('/remove-from-carers/:id', (req, res) => {
  db.run('DELETE FROM carer_jobs WHERE post_id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Removed post from all carers' });
  });
});


router.get('/available', (req, res) => {
  if (req.session.user?.role !== 'carer') return res.sendStatus(403);

  const carerId = req.session.user.id;

  db.all(
    `SELECT posts.*, users.username
     FROM posts
     JOIN users ON posts.user_id = users.id
     WHERE posts.id NOT IN (
       SELECT post_id FROM carer_jobs WHERE carer_id = ?
     )`,
    [carerId],
    (err, posts) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(posts);
    }
  );
});

router.get('/all', (req, res) => {
    db.all("SELECT posts.*, users.username FROM posts JOIN users on posts.user_id = users.id", [], (err, posts) => {
        if (err) return res.status(500).json({ error: err.message })
            res.json(posts)
    })
})

module.exports = router;
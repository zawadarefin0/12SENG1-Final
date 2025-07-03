const express = require('express');
const db = require('../db/database');
const router = express.Router();

// Creation of post as a pet owner
router.post('/add', (req, res) => {
    if (req.session.user?.role !== 'owner') return res.sendStatus(403)
    const { pet_name, pet_age, description, services } = req.body;
    const servicesStr = Array.isArray(services) ? services.join(', ') : services;
    db.run('INSERT INTO posts (user_id, pet_name, pet_age, description, services) VALUES (?, ?, ?, ?, ?)',
        [req.session.user.id, pet_name, pet_age, description, servicesStr],
        err => {
            if (err) return res.status(500).json({ error: err.message })
            res.json({ message: "Post created" })
        }
    )
})

//  Accepting jobs as a pet carer
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

// Showing all of your pets on your profile page
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

// Remove accepted job from carer profile
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

router.delete('/:id', (req, res) => {
  if (req.session.user?.role !== 'owner') return res.sendStatus(403);

  const postId = req.params.id;

  // Verify the post belongs to this owner
  db.get('SELECT user_id FROM posts WHERE id = ?', [postId], (err, post) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (post.user_id !== req.session.user.id) return res.status(403).json({ error: "Not your post" });

    // Delete post
    db.run('DELETE FROM posts WHERE id = ?', [postId], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Post deleted" });
    });
  });
});

// View jobs that you have accepted as a carer
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


// Removes post from carers list
router.delete('/remove-from-carers/:id', (req, res) => {
  db.run('DELETE FROM carer_jobs WHERE post_id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Removed post from all carers' });
  });
});


// Show the posts available after the pet carer has accepted more than one post
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
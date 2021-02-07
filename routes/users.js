const express = require('express');
const router = express.Router();
const { User } = require('../models/user');

/* Login */
router.get('/login', (req, res) => {
  res.render('index', { error: false });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const result = await User.checkUser(username, password);
  if (result) {
    res.redirect('/messages?username=' + username);
  } else {
    res.render('index', { error: true });
  }
});

/* Register */
router.get('/register', (req, res) => {
  res.render('register', { error: false });
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({username});
  const error = true;
  if (user) {
    res.render('register', { error });
  } else {
    const newUser = new User({
      username,
      password
    });
    newUser.save(function(err, doc) {
      if (err) {
        res.render('register', { error });
      }
      setTimeout(() => {
        res.redirect('/users/login');
      }, 1500);
    });
  }
});

module.exports = router;

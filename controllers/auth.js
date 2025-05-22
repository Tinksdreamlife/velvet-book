const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 6;

// ALL paths start with "/auth"

// GET /auth/sign-up
router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up.ejs', { error: '' });
});

// POST /auth/sign-up

// POST /auth/sign-up
router.post('/sign-up', async (req, res) => {
  try {
    const { username, password, confirmPassword } = req.body;

    if (password !== confirmPassword) throw new Error('Passwords Do Not Match');

    // Normalize and clean the username input
    const normalizedUsername = username.trim().toLowerCase();

    // Check if the user already exists
    const existingUser = await User.findOne({ username: normalizedUsername });
    if (existingUser) throw new Error('User Already Exists');

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);

    // Create the new user
    const user = await User.create({
      username: normalizedUsername,
      password: hashedPassword,
    });

    // Log the user in by setting session
    req.session.userId = user._id;

    // Redirect to dashboard
    res.redirect('/dashboard');

  } catch (err) {
    res.render('auth/sign-up.ejs', { error: err.message });
  }
});


// router.post('/sign-up', async (req, res) => {
//   try {
//     if (req.body.password !== req.body.confirmPassword) throw new Error('Passwords Do Not Match');
//     req.body.password = bcrypt.hashSync(req.body.password, SALT_ROUNDS);
//     const user = await User.create(req.body);
//     req.session.userId = user._id;
//     res.redirect('/dashboard')
//   } catch (err) {
//     if (err.message.includes('duplicate key')) err.message = 'User Already Exists';
//     res.render('auth/sign-up.ejs', { error: err.message });
//   }
// });

// GET /auth/sign-in 
router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in.ejs', { error: '' });
});

// POST /auth/sign-in
router.post('/sign-in', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) throw new Error();
    const isValidPassword = bcrypt.compareSync(req.body.password, user.password);
    if (!isValidPassword) throw new Error();
    req.session.userId = user._id;
    res.redirect('/dashboard');
  } catch {
    res.render('auth/sign-in.ejs', { error: 'Invalid Credentials' });
  }
});

// GET /auth/sign-out
router.get('/sign-out', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
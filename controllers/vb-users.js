const express = require('express');
const router = express.Router();
// User = require('..models.user.js');

// Middleware used to protect routes that need a logged in user
const ensureLoggedIn = require('../middleware/ensure-logged-in');

// This is how we can more easily protect ALL routes for this router
// router.use(ensureLoggedIn);

// ALL paths start with '/vb-users'

// DO I NEED AN INDEX OF ALL USERS? 
// I do NOT think I will be having anyone pull them up!
// index action
// GET /vb-users
// Example of a non-protected route

// router.get('/', (req, res) => {
//   res.send('List of all vb-users - not protected');
// });

// GET /vb-users/new
// Example of a protected route
router.get('/new', ensureLoggedIn, (req, res) => {
  res.send('Create a new VB User!');
});

module.exports = router;
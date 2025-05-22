const express = require('express');
const router = express.Router();
User = require('../models/user.js');
const ensureLoggedIn = require('../middleware/ensure-logged-in');

// GET /vb-users/new
// Example of a protected route
router.get('/new', ensureLoggedIn, (req, res) => {
  res.send('Create a new VB User!');
});

module.exports = router;
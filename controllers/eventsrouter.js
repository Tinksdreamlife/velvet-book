const express = require('express');
const router = express.Router();
User = require('../models/user.js');

module.exports = router;

// Create NEW event form route/action
outer.get('/new', (req, res) => {
  res.render('events/newevent.ejs');
});

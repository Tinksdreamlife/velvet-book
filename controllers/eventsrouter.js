const express = require('express');
const router = express.Router();
User = require('../models/user.js');



// Create NEW event form route/action
router.get('/new', (req, res) => {
  res.render('events/newevent');
});

module.exports = router;
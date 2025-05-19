const express = require('express');
const User = require('../models/user.js');
const router = express.Router();




// Create NEW event form route/action
router.get('/new', (req, res) => {
    res.render('events/newevent');
});

// SHOW all events after the new event is added

router.post('/', async (req, res) => {
    try {

        const newEvent = req.body;
        const username = req.session.username;
        const user = req.user;

        if (!user) {
            return res.status(404).send("User not found.");
        }

        user.events.push(newEvent);
        await user.save();

        res.redirect('/events/allevents');

    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong while saving the event.");
    }
});

// GET allevents - SHOW all events for this user
router.get('/allevents', async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).send("You must be logged in to view events.")
        }

        const populatedUser = await User.findById(user._id);

        res.render('events/allevents', { events: populatedUser.events })
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading events.");
    }
});

module.exports = router;
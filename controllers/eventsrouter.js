const express = require('express');
const User = require('../models/user.js');
const { parse } = require('dotenv');
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

// GET allevents - Makes them seen but still not clickable
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

// GET/events/:eventId - in order to see the deets for a single event
router.get('/:eventId', async (req, res) => {

    try {
        const user = req.user || await User.findById(req.session.userId);
        const eventId = req.params.eventId;

        if (!user) {
            return res.status(401).send("You must be logged in to view events.")
        }

        const populatedUser = await User.findById(user._id);
        const event = populatedUser.events.id(eventId);

        if (!event) {
            return res.status(404).send("Event not found.");
        }

        res.render('events/showevent', { event });
        
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving event.");
    }
});

// router.get('/:index', async (req, res) => {

//     try {
//         const index = parseInt(req.params.index);
//         const populatedUser = await User.findById(req.session.userid);

//         if (!populatedUser) {
//             return res.status(401).send("User not found.")
//         }

//         const event = populatedUser.events[index];

//         if (!event) {
//             return res.status(404).send("Event not found.");
//         }

//         res.render('events/showevent', { event });

//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Server error retrieving event.");
//     }
// });

module.exports = router;
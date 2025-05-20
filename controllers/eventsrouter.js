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

// EDIT route/action - part 1
// GET /events/:eventsId/edit to SHOW form

router.get('/:eventId/edit', async (req, res) => {
    try {
        const user = req.user || await User.findById(req.session.userId);
        const eventId = req.params.eventId;

        if (!user) return res.status(401).send("You must be logged in");
            const populatedUser = await User.findById(user._id);
            const event = populatedUser.events.id(eventId);
           
            if (!event) return res.status(404).send("Event not found.");

        res.render('events/editevent', { event });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading event form.");
    }
});

// EDIT route/action - part 2
// PUT /events/:eventID to SUBMIT form and UPDATE

router.put('/:eventId', async (req, res) => {
    try {
        const user = req.user || await User.findById(req.session.userId);
        const eventId = req.params.eventId;

        if (!user) return res.status(401).send("You must be logged in.");
        const populatedUser = await User.findById(user._id);
        const event = populatedUser.events.id(eventId);

        if (!event) return res.status(404).send("Event not found.");

        event.dateOfEvent = req.body.dateOfEvent;
        event.venueName = req.body.venueName;
        event.income = req.body.income;
        event.expenseHouseFee = req.body.expenseHouseFee;
        event.expenseTipOut = req.body.expenseTipOut;
        event.expenseTravel = req.body.expenseTravel;
        event.expensePromo = req.body.expensePromo;
        event.expenseOther = {
            amount: req.body["expenseOther.amount"],
            note: req.body["expenseOther.note"],
        };
        await populatedUser.save();
        res.redirect(`/events/${eventId}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating event.");
    }
});

module.exports = router;
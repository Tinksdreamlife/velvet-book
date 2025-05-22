const express = require('express');
const User = require('../models/user.js');
const { parse } = require('dotenv');
const { default: mongoose } = require('mongoose');
const router = express.Router();






// Create NEW event form route/action
router.get('/new', (req, res) => {
    res.render('events/newevent');
});

// SHOW all events after the new event is added

router.post('/', async (req, res) => {
    console.log('📨 Received form submission:', req.body);
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).send("User not found.");
        }
        const newEvent = {
            dateOfEvent: new Date(req.body.dateOfEvent),
            venueName: req.body.venueName,
            income: Number(req.body.income),
            expenseHouseFee: Number(req.body.expenseHouseFee),
            expenseTipOut: Number(req.body.expenseTipOut),
            expenseTravel: Number(req.body.expenseTravel),
            expensePromo: Number(req.body.expensePromo),
            expenseOther: {
                amount: Number(req.body["expenseOther.amount"]),
                note: req.body["expenseOther.note"]
            }
        };



        // const username = req.session.username;

        user.events.push(newEvent);
        await user.save();

        res.redirect('/events/allevents');

    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong while saving the event.");
    }
});

//     try {

//         const newEvent = req.body;
//         const username = req.session.username;
//         const user = req.user;

//         if (!user) {
//             return res.status(404).send("User not found.");
//         }

//         user.events.push(newEvent);
//         await user.save();

//         res.redirect('/events/allevents');

//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Something went wrong while saving the event.");
//     }
// });

// GET allevents - Makes them seen but still not clickable
router.get('/allevents', async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).send("You must be logged in to view events.")
        }

        const populatedUser = await User.findById(user._id);

        const sortedEvents = populatedUser.events
            .map(event => ({
                ...event.toObject(),
                formattedDate: new Date(event.dateOfEvent).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
            }))
            .sort((a, b) => new Date(b.dateOfEvent) - new Date(a.dateOfEvent)); // Descending


        res.render('events/allevents', { events: sortedEvents })
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

//  DELETE route/action
// delete /:id
// my events are a subdocument in my User model so BE CAREFUL when setting up DELETE

router.delete('/:id', async (req, res) => {
    try {
        const eventId = new mongoose.Types.ObjectId(req.params.id);
        const user = await User.findOne({ 'events._id': eventId });
        if (!user) {
            return res.status(404).send('Event not found.');
        }

        user.events.pull({ _id: eventId });

        //    user.events.id(req.params.id).remove(); //this will remove the event from the user's array

        // const index = user.events.findIndex(event => event._id === req.params.id);
        // if (index === -1) {
        //     return res.status(404).send('Event not found.');
        // }

        // user.events.splice(index, 1);
        await user.save();
        // const event = user.events.id(eventId);

        // if (!event) {
        //     return res.status(404).send('Event not found.');
        // }
        //     event.remove();


        res.redirect('/events/allevents');

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
require("dotenv").config();

const express = require("express");
const app = express();

const eventsRouter = require('./controllers/eventsrouter');

const mongoose = require("mongoose");
const methodOverride = require("method-override");
// logging middleware
const morgan = require("morgan");
const session = require('express-session');

// Set the port from environment variable or default to 3000
const port = process.env.PORT || 3000;


// Learned this is supposed to enable EJS rendering (below)
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));


mongoose.connect(process.env.MONGODB_URI);

// Listen for the 'connected' event. 
// .on is similar to addEventListener in the DOM
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware to "serve"/return static assets, e.g., stylesheets,
// when requested by the browser.
// 'public' is the folder name that all static assets will be saved in.
app.use(express.static('public'));

// Middleware to parse URL-encoded data from forms
// app.use(express.urlencoded({ extended: false }));
//The above was taken out because it was conflicting with the true
// statement at the beginning 
//and it was better to keep the true statement because that
// allows nested objects!

// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan('dev'));

// Sessions are how the server "remembers" which
// user the curren request is from
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// If a user is logged in, add the user's doc to req.user and res.locals.user
app.use(require('./middleware/add-user-to-req-and-locals'));

// configures EJS to support root-based includes:
const path = require('path');
const User = require("./models/user");
app.set('views', path.join(__dirname, 'views'));

// Routes below

// GET / (root/default) -> Home Page
app.get('/', (req, res) => {
  res.render('home.ejs');
});

// DASHBOARD route for users when signed in!
app.get('/dashboard', async (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/auth/sign-in');
  }

  const user = await User.findById(req.session.userId);
  if (!user) {
    return res.redirect('/auth/sign-in');
  }

  res.render('dashboard', { user });
});



// The '/auth' is the "starts with" path.  The
// paths defined in the router/controller will be
// appended to the "starts with" path
app.use('/auth', require('./controllers/auth'));

// Update the unicorns data resource with your "main" resource
app.use('//vb-users', require('./controllers/vb-users'));
app.use('/events', eventsRouter); //for the NEW, EDIT and DELETE events


// This is the route to POST the ADD EVENT form


app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
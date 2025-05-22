require("dotenv").config();

const express = require("express");
const app = express();
const eventsRouter = require('./controllers/eventsrouter');
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require('express-session');
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.static('public'));
app.use(methodOverride("_method"));
app.use(morgan('dev'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(require('./middleware/add-user-to-req-and-locals'));

const path = require('path');
const User = require("./models/user");
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('home.ejs');
});

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


app.use('/auth', require('./controllers/auth'));
app.use('//vb-users', require('./controllers/vb-users'));
app.use('/events', eventsRouter);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
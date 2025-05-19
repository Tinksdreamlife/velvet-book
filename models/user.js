const { text } = require('express');
const mongoose = require("mongoose");
// shortcut variable
const Schema = mongoose.Schema;

const eventSchema = new mongoose.Schema({

  dateOfEvent: {
    type: Date,
    required: true,
  },

  venueName: {
    type: String,
    required: true,
  }, 
  
  income: {
    type: Number,
    required: true,
  },

  expenseHouseFee: {
    type: Number,
    required: true,
  },

  expenseTipOut: {
    type: Number,
    required: true,
  },

  expenseTravel: {
    type: Number,
    required: true,
  },

  expensePromo: {
    type: Number,
    required: true,
  },

  expenseOther: {
    type: Number,
    note: String,
  },
})

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
 
  // NOTE: 05-16-25 the timestamp function was crashing 
  // the app so I need to look at why and what it was made for
  // Mongoose will maintain a createdAt & updatedAt property
  // timestamps: true

  events: [eventSchema]

});

const User = mongoose.model('User', userSchema);

module.exports = User;

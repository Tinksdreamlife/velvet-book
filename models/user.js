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
    amount: { type: Number, required: true },
    note: { type: String }
  }
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

  events: [eventSchema]

});

const User = mongoose.model('User', userSchema);

module.exports = User;

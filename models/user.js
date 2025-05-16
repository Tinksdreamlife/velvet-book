const mongoose = require("mongoose");
// shortcut variable
const Schema = mongoose.Schema;

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
});

module.exports = mongoose.model("User", userSchema);

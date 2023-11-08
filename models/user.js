const mongoose = require('mongoose');
const validator = require('validator');

const user = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 30
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isURL(value),
      message: "Invalid URL for avatar"
    }
  }
})

module.exports = mongoose.model('user', user);
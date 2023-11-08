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
      validator: (v) => validator.isURL(v),
      message: "Invalid URL for avatar"
    }
  }
})

module.exports = mongoose.model('user', user);
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
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "Invalid email format",
    }
  },
  password: {
    type: String,
    required: true,
    select: false,
  }
})

module.exports = mongoose.model('User', user);
const mongoose = require('mongoose');

const validator = require('validator');

const clothingItem = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30
  },
  weather: {
    type: String,
    required: true,
    enum: ['hot', 'cold', 'warm']
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Link is not valid',
    },
  },
  owner: {
    type: String,
    ref: user,
    required: true,
  },
  likes: {
    type: String,
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('clothingItems', clothingItem);
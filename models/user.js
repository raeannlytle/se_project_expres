const user = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 30
  },
  avatar: {
    type: String,
    required: true,

  }
})

module.exports = mongoose.model('user', user);
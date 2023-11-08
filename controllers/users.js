const User = require('../models/user');
const {BAD_REQUEST, SERVER_ERROR, NOT_FOUND} = require('../utils/errors');

const getUser = (req, res) => {
  const {userId} = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({message: "User not found"});
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        res.status(BAD_REQUEST).send({message: "Invalid ID format"});
      } else {
        res.status(SERVER_ERROR).send({message: "Error from getUser"});
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
  .then((users) => {
    res.status(200).send({data: users});
  })
  .catch(() => res.status(SERVER_ERROR).send({message: "Error from getUsers"}))
}

const createUser = (req, res) => {
  const {name, avatar} = req.body;

  if (!name || !avatar) {
    return res.status(BAD_REQUEST).send({message: "Name and avatar are required"})
  }

  const newUser = new User({name, avatar});

  newUser.save()
  .then((user) => {
    res.status(200).send({data: user});
  })
  .catch((e) => {
    if (e.name === 'ValidationError') {
      res.status(BAD_REQUEST).send({message: "Validation error"});
    } else {
      res.status(SERVER_ERROR).send({message: "Error from createUser"});
    }
  });
  return null;
}

module.exports = {
  getUser,
  getUsers,
  createUser
}
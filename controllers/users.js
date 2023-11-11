const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {BAD_REQUEST, UNAUTHORIZED, SERVER_ERROR, NOT_FOUND} = require('../utils/errors');
const {JWT_SECRET} = require('../utils/config');

const createUser = async (req, res) => {
  const {name, avatar, email, password} = req.body;

  if (!name || !avatar || !email || !password) {
    return res.status(BAD_REQUEST).send({message: "All fields are required"})
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(BAD_REQUEST).send({ message: "Email is already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, avatar, email, password: hashedPassword });

    const savedUser = await newUser.save();

    res.status(200).send({ data: savedUser });
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(BAD_REQUEST).send({ message: "Validation error" });
    } else {
      res.status(SERVER_ERROR).send({ message: "Error from createUser" });
    }
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);

    if (!user) {
      return res.status(UNAUTHORIZED).send({ message: "Invalid email or password" });
    }

    const userWithPassword = await User.findOne({email}).select('+password');
    console.log("Password hash", userWithPassword.password);

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).send({ token });
  } catch (e) {
    res.status(SERVER_ERROR).send({ message: "Error from login controller" });
  }
};

const getCurrentUser = (req, res) => {
  const loggedInUserId = req.user._id;

  User.findById(loggedInUserId)
  .then((user) => {
    if (!user) {
      res.status(NOT_FOUND).send({message: "User not found"});
    } else {
      res.status(200).send({data: user});
    }
  })
  .catch((e) => {
    if (e.name === "CastError") {
      res.status(BAD_REQUEST).send({message: "Invalid ID format"});
    } else {
      res.status(SERVER_ERROR).send({message: "Error from getCurrentUser"});
    }
  });
}

const updateUserProfile = async (req, res) => {
  const {name, avatar} = req.body;
  const loggedInUserId = req.user._id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      loggedInUserId,
      {name, avatar},
      {new: true, runValidators: true}
    );

    if (!updatedUser) {
      return res.status(NOT_FOUND).send({message: "User not found"});
    }

    res.status(200).send({data: updatedUser});
  } catch(e) {
    if(e.name === "ValidationError") {
      res.status(BAD_REQUEST).send({message: "Validation error"});
    } else if (e.name === "CastError") {
      res.status(BAD_REQUEST).send({message: "Invalid ID format"});
    } else {
      res.status(SERVER_ERROR).send({message: "Error from updateUserProfile"});
    }
  }
}

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUserProfile
}
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  BAD_REQUEST,
  UNAUTHORIZED,
  CONFLICT,
  SERVER_ERROR,
  NOT_FOUND,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const createUser = async (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !avatar || !email || !password) {
    return next({ status: BAD_REQUEST, message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next({ status: CONFLICT, message: "Email is already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, avatar, email, password: hashedPassword });

    const savedUser = await newUser.save();

    const userResponse = {
      _id: savedUser._id,
      name: savedUser.name,
      avatar: savedUser.avatar,
      email: savedUser.email,
    };

    res.status(200).send({ data: userResponse });
  } catch (error) {
    if (error.name === "ValidationError") {
      return next({ status: BAD_REQUEST, message: "Validation error" });
    }
    return next({ status: SERVER_ERROR, message: "Error from createUser" });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next({
        status: UNAUTHORIZED,
        message: "Invalid email or password",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return next({
        status: UNAUTHORIZED,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({ token });
  } catch (e) {
    return next({
      status: SERVER_ERROR,
      message: "Error from login controller",
    });
  }
};

const getCurrentUser = (req, res, next) => {
  const loggedInUserId = req.user._id;

  User.findById(loggedInUserId)
    .then((user) => {
      if (!user) {
        return next({ status: NOT_FOUND, message: "User not found" });
      }
      res.status(200).send({ data: user });
    })
    .catch((e) => {
      if (e.name === "CastError") {
        return next({ status: BAD_REQUEST, message: "Invalid ID format" });
      }
      return next({
        status: SERVER_ERROR,
        message: "Error from getCurrentUser",
      });
    });
};

const updateUserProfile = async (req, res, next) => {
  const { name, avatar } = req.body;
  const loggedInUserId = req.user._id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      loggedInUserId,
      { name, avatar },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      return next({ status: NOT_FOUND, message: "User not found" });
    }

    res.status(200).send({ data: updatedUser });
  } catch (e) {
    if (e.name === "ValidationError") {
      return next({ status: BAD_REQUEST, message: "Validation error" });
    }
    if (e.name === "CastError") {
      return next({ status: BAD_REQUEST, message: "Invalid ID format" });
    }
    return next({
      status: SERVER_ERROR,
      message: "Error from updateUserProfile",
    });
  }
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUserProfile,
};

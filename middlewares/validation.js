const { celebrate, Joi } = require("celebrate");
const validator = require("validator");

const validationAddClothingItem = celebrate({
  body: {
    itemName: Joi.string().required().min(2).max(30),
    imageUrl: Joi.string().required().uri(),
  },
});

const validateNewUser = celebrate({
  body: {
    userName: Joi.string().required().min(2).max(30),
    userAvatar: Joi.string().required().uri(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  },
});

const validateUserLogin = celebrate({
  body: {
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  },
});

const validateIdParam = celebrate({
  params: {
    id: Joi.string().hex().length(24).required(),
  },
});

module.exports = {
  validationAddClothingItem,
  validateNewUser,
  validateUserLogin,
  validateIdParam,
};

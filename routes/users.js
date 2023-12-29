const { celebrate, Joi, Segments } = require("celebrate");
const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");

const { getCurrentUser, updateUserProfile } = require("../controllers/users");

const updateUserProfileSchema = {
  [Segments.BODY]: {
    name: Joi.string(),
    avatar: Joi.string().uri(),
  },
};

router.get("/me", authMiddleware, getCurrentUser);
router.patch(
  "/me",
  authMiddleware,
  celebrate(updateUserProfileSchema),
  updateUserProfile,
);

module.exports = router;

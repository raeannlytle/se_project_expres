const { celebrate, Joi, Segments } = require("celebrate");
const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItem");

const itemValidationSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    weather: Joi.string().required(),
    imageUrl: Joi.string().required(),
  }),
};

const itemIdValidationSchema = {
  [Segments.PARAMS]: {
    itemId: Joi.string().required(),
  },
};

// CRUD

// Create
router.post("/", authMiddleware, celebrate(itemValidationSchema), createItem);

// Read
router.get("/", getItems);

// Delete
router.delete(
  "/:itemId",
  authMiddleware,
  celebrate(itemIdValidationSchema),
  deleteItem,
);

// Like
router.put(
  "/:itemId/likes",
  authMiddleware,
  celebrate(itemIdValidationSchema),
  likeItem,
);

// Unlike
router.delete(
  "/:itemId/likes",
  authMiddleware,
  celebrate(itemIdValidationSchema),
  unlikeItem,
);

module.exports = router;

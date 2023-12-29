const { BadRequestError } = require("../utils/errors/BadRequestError");
const { NotFoundError } = require("../utils/errors/NotFoundError");
const { ForbiddenError } = require("../utils/errors/ForbiddenError");
const { ServerError } = require("../utils/errors/ServerError");

const ClothingItem = require("../models/clothingItem");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user && req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        res.status(BadRequestError("Validation error")).send();
      } else {
        res.status(ServerError("Error from createItem")).send();
      }
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch(() => res.status(ServerError("Error from getItems")).send());
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user && req.user._id;

  ClothingItem.findById(itemId)
    .orFail()
    .then((clothingItem) => {
      if (clothingItem.owner.toString() !== userId) {
        return res
          .status(
            ForbiddenError("You do not have permission to delete this item"),
          )
          .send();
      }

      return ClothingItem.findByIdAndDelete(itemId).then(() =>
        res.status(200).send({ message: "Item successfully deleted" }),
      );
    })
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        res.status(NotFoundError("Item not found")).send();
      } else if (e.name === "CastError") {
        res.status(BadRequestError("Invalid ID format")).send();
      } else {
        res.status(ServerError("Error from deleteItem")).send();
      }
    });
};

const likeItem = (req, res) => {
  const { _id: userId } = req.user || {};
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        res.status(NotFoundError("Item not found")).send();
      } else if (e.name === "CastError") {
        res.status(BadRequestError("Invalid ID format")).send();
      } else {
        res.status(ServerError("Error from likeItem")).send();
      }
    });
};

const unlikeItem = (req, res) => {
  const { _id: userId } = req.user || {};
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        res.status(NotFoundError("Item not found")).send();
      } else if (e.name === "CastError") {
        res.status(BadRequestError("Invalid ID format")).send();
      } else {
        res.status(ServerError("Error from unlikeItem")).send();
      }
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
};

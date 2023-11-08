const { response } = require('express');
const ClothingItem = require('../models/clothingItem');
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

const createItem = (req, res) => {
  const {name, weather, imageUrl} = req.body;

  ClothingItem.create({name, weather, imageUrl}).then((item) => {
    res.send({data:item})
  }).catch((e) => {
    if (e.name === "ValidationError") {
      res.status(BAD_REQUEST).send({message: "Validation error"});
    } else {
      res.status(SERVER_ERROR).send({message: "Error from createItem"})
    }
  })
};

const getItems = (req, res) => {
  ClothingItem.find({}).then((items) => res.status(OK).send(items))
  .catch((e) => {
    if (e.name === "ValidationError") {
      res.status(BAD_REQUEST).send({message: "Validation error"});
    } else {
      res.status(SERVER_ERROR).send({message: "Error from getItems"})
    }
  })
};

const updateItem = (req, res) => {
  const {itemId} = req.params;
  const {imageUrl} = req.body;
  ClothingItem.findByIdAndUpdate(itemId, {$set: {imageUrl}})
  .orFail(() => ({name: "DocumentNotFoundError"}))
  .then((item) => res.status(OK).send({data: item}))
  .catch((e) => {
    if (e.name === "DocumentNotFoundError") {
      res.status(NOT_FOUND).send({message: "Item not found"})
    } else if (e.name === "ValidationError") {
      res.status(BAD_REQUEST).send({message: "Validation error"})
    } else if (e.name === "CastError") {
      res.status(BAD_REQUEST).send({message: "Invalid ID format"})
    } else {
      res.status(SERVER_ERROR).send({message: "Error from updateItem"})
    }
  })
};

const deleteItem = (req, res) => {
  const {itemId} = req.params;
  ClothingItem.findByIdAndDelete(itemId)
  .orFail(() => ({name: "DocumentNotFoundError"}))
  .then((item) => res.status(OK).send({}))
  .catch((e) => {
    if (e.name === "DocumentNotFoundError") {
      res.status(NOT_FOUND).send({message: "Item not found"})
    } else if (e.name === "ValidationError") {
      res.status(BAD_REQUEST).send({message: "Validation error"});
    } else if (e.name === "CastError") {
      res.status(BAD_REQUEST).send({message: "Invalid ID format"})
    } else {
      res.status(SERVER_ERROR).send({message: "Error from deleteItem"})
    }
  })
}

const likeItem = (req, res) => {
  const {_id: userId} = req.user;
  const {itemId} = req.params;

  ClothingItem.findByIdAndUpdate(itemId, {$addToSet: {likes: userId}}, {new:true})
  .orFail(() => ({name: "DocumentNotFoundError"}))
  .then((item) => res.status(OK).send({data:item}))
  .catch((e) => {
    if (e.name === "DocumentNotFoundError") {
      res.status(NOT_FOUND).send({message: "Item not found"})
    } else if (e.name === "ValidationError") {
      res.status(BAD_REQUEST).send({message: "Validation error"})
    } else if (e.name === "CastError") {
        res.status(BAD_REQUEST).send({message: "Invalid ID format"})
    } else {
      res.status(SERVER_ERROR).send({message: "Error fro likeItem"})
    }
});
};

const unlikeItem = (req, res) => {
  const {_id: userId} = req.user;
  const {itemId} = req.params;

  ClothingItem.findByIdAndUpdate(itemId, {$pull: {likes: userId}}, {new: true})
  .orFail(() => ({name: "DocumentNotFoundError"}))
  .then((item) => res.status(OK).send({data: item}))
  .catch((e) => {
    if (e.name === "DocumentNotFoundError") {
      res.status(NOT_FOUND).send({message: "Item not found"})
    } else if (e.name === "ValidationError") {
      res.status(BAD_REQUEST).send({message: "Validation error"})
    } else if (e.name === "CastError") {
      res.status(BAD_REQUEST).send({message: "Invalid ID format"})
    } else {
      res.status(SERVER_ERROR).send({message: "Error from unlikeItem"})
    }
});
}


module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  unlikeItem
}

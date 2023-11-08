const { response } = require('express');
const ClothingItem = require('../models/clothingItem');

const OK = 200;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

const createItem = (req, res) => {
  const {name, weather, imageURL} = req.body;

  ClothingItem.create({name, weather, imageURL}).then((item) => {
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
  const {imageURL} = req.body;
  ClothingItem.findByIdAndUpdate(itemId, {$set: {imageURL}})
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

const ClothingItem = require('../models/clothingItem');

const OK = 200;
const BAD_REQUEST = 400;
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
    res.status(SERVER_ERROR).send({message: 'Error from getItems', e})
  })
};

const updateItem = (req, res) => {
  const {itemId} = req.params;
  const {imageURL} = req.body;
  ClothingItem.findByIdAndUpdate(itemId, {$set: {imageURL}}).orFail().then((item) => res.status(OK).send({data: item}))
  .catch((e) => {
    res.status(SERVER_ERROR).send({message: 'Error from updateItem', e})
  })
};

const deleteItem = (req, res) => {
  const {itemId} = req.params;
  ClothingItem.findByIdAndDelete(itemId).orFail().then((item) => res.status(OK).send({}))
  .catch((e) => {
    res.status(SERVER_ERROR).send({message: 'Error from deleteItem', e})
  })
}

const likeItem = (req, res) => {
  const {_id: userId} = req.user;
  const {itemId} = req.params;

  ClothingItem.findByIdAndUpdate(itemId, {$addToSet: {likes: userId}}, {new:true}).then((item) => res.status(OK).send({data:item}))
  .catch((e) => {res.status(SERVER_ERROR).send({message: 'Error from likeItem', e});
});
};

const unlikeItem = (req, res) => {
  const {_id: userId} = req.user;
  const {itemId} = req.params;

  ClothingItem.findByIdAndUpdate(itemId, {$pull: {likes: userId}}, {new: true}).then((item) => res.status(OK).send({data: item}))
  .catch((e) => {res.status(SERVER_ERROR).send({message: 'Error from unlikeItem', e});
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

const ClothingItem = require('../models/clothingItem');

const createItem = (req, res) => {
  const {name, weather, imageURL} = req.body;

  ClothingItem.create({name, weather, imageURL}).then((item) => {
    res.send({data:item})
  }).catch((e) => {
    res.status(500).send({message: 'Error from createItem', e })
  })

  module.exports.createClothingItem = (req, res) => {
    console.log(req.user._id);// _id will become accessible
  };
};

const getItems = (req, res) => {
  ClothingItem.find({}).then((items) => res.status(200).send(items))
  .catch((e) => {
    res.status(500).send({message: 'Error from getItems', e})
  })
};

const updateItem = (req, res) => {
  const {itemId} = req.params;
  const {imageURL} = req.body;
  ClothingItem.findByIdAndUpdate(itemId, {$set: {imageURL}}).orFail().then((item) => res.status(200).send({data: item}))
  .catch((e) => {
    res.status(500).send({message: 'Error from updateItem', e})
  })
};

const deleteItem = (req, res) => {
  const {itemId} = req.params;
  ClothingItem.findByIdAndDelete(itemId).orFail().then((item) => res.status(200).send({}))
  .catch((e) => {
    res.status(500).send({message: 'Error from deleteItem', e})
  })
}

const likeItem = (req, res) => {
  const {itemId} = req.params;
  const {_id: userId} = req.user;

  ClothingItem.findByIdAndUpdate(itemId, {$addToSet: {likes: userId}}, {new:true}).then((item) => res.status(200).send({data:item}))
  .catch((e) => {res.status(500).send({message: 'Error from likeItem', e});
});
};



module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem
}

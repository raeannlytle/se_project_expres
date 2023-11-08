const router = require('express').Router();

const { createItem, getItems, deleteItem, likeItem, unlikeItem } = require('../controllers/clothingItem');

//CRUD


//Create
router.post('/', createItem);

//Read
router.get('/', getItems);

//Delete
router.delete('/:userId', deleteItem);

//Like
router.put('/:userId/likes', likeItem);

//Unlike
router.delete('/:userId/likes', unlikeItem);

module.exports = router;
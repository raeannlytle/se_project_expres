const router = require('express').Router();

const { createItem, getItems } = require('../controllers/clothingItem');

//CRUD


//Create
router.post('/', createItem);

//Read
router.get('/', getItems);

//Update

//Delete

module.exports = router;
const router = require('express').Router();

const {getUsers, getUser, createUser} = require('../controllers/users');

// CRUD

// Create
router.post('/', createUser);

// Get
router.get('/', getUsers);
router.get('/:userId', getUser);

module.exports = router;
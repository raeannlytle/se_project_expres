const router = require('express').Router();

const {getUsers, getUser, createUser} = require('../controllers/users');

// CRUD

// Create
router.post('/', createUser);

// Get
router.get('/users', getUsers);
router.get('/users/:userId', getUser);

module.exports = router;
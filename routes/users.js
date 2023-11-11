const router = require('express').Router();

const {getCurrentUser, updateUserProfile} = require('../controllers/users');

router.get('/me', authMiddleware, getCurrentUser);
router.patch('/me', authMiddleware, updateUserProfile);

module.exports = router;
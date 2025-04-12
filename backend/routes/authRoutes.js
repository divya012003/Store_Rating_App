const express = require('express');
const { register, login, logout, updatePassword } = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.put('/password', isAuthenticated, updatePassword);

module.exports = router;

const express = require('express');
const { getAllStores, searchStores, addStore } = require('../controllers/storeController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', isAuthenticated, getAllStores);
router.get('/search', isAuthenticated, searchStores);
router.post('/add', isAuthenticated, allowRoles('admin'), addStore);

module.exports = router;

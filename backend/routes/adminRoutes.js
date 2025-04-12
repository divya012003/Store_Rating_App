const express = require('express');
const { getDashboardStats, addUser, listUsers, listStores } = require('../controllers/adminController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/dashboard', isAuthenticated, allowRoles('admin'), getDashboardStats);
router.post('/add-user', isAuthenticated, allowRoles('admin'), addUser);
router.get('/users', isAuthenticated, allowRoles('admin'), listUsers);
router.get('/stores', isAuthenticated, allowRoles('admin'), listStores);

module.exports = router;

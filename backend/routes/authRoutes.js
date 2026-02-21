const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, getUsers, deleteUser, updateUserStatus } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getMe);
router.put('/profile', protect, updateProfile);

// Admin / Manager routes
router.get('/users', protect, authorize('admin', 'manager'), getUsers);
router.patch('/users/:id/status', protect, authorize('admin', 'manager'), updateUserStatus);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

module.exports = router;

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { createOrder, getMyOrders, getAdminOrders, updateOrderStatus } = require('../controllers/orderController');

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/admin', protect, authorize('admin', 'manager'), getAdminOrders);
router.patch('/:id/status', protect, updateOrderStatus);

module.exports = router;

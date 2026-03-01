const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createBooking, getMyBookings, getLandlordBookings, updateBookingStatus } = require('../controllers/bookingController');

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/landlord', protect, getLandlordBookings);
router.patch('/:id/status', protect, updateBookingStatus);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  getMyListings,
  getAdminListings,
  updateListingStatus,
  getDashboardStats
} = require('../controllers/listingController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getListings);
router.get('/stats', protect, authorize('admin', 'manager'), getDashboardStats);
router.get('/admin', protect, authorize('admin', 'manager'), getAdminListings);
router.get('/my', protect, getMyListings);
router.get('/:id', getListing);
router.post('/', protect, upload.array('images', 5), createListing);
router.put('/:id', protect, upload.array('images', 5), updateListing);
router.patch('/:id/status', protect, authorize('admin', 'manager'), updateListingStatus);
router.delete('/:id', protect, deleteListing);

module.exports = router;

const { Booking, Listing, User } = require('../models');

// @desc    Create a visitation booking
// @route   POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { listingId, visitationDate, visitationTime, message } = req.body;
    
    // Check if listing exists and is a house for rent
    const listing = await Listing.findByPk(listingId);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }
    
    if (listing.type !== 'rent' || listing.category !== 'house') {
      return res.status(400).json({ success: false, message: 'This listing cannot be booked for visitation' });
    }

    const booking = await Booking.create({
      userId: req.user.id,
      listingId,
      visitationDate,
      visitationTime,
      message
    });

    res.status(201).json({ success: true, booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to create booking' });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my-bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user.id },
      include: [{ model: Listing, as: 'listing' }],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to get bookings' });
  }
};

// @desc    Get bookings for landlord's listings
// @route   GET /api/bookings/landlord
const getLandlordBookings = async (req, res) => {
  try {
    const listings = await Listing.findAll({ where: { userId: req.user.id }, attributes: ['id'] });
    const listingIds = listings.map(l => l.id);

    const bookings = await Booking.findAll({
      where: { listingId: listingIds },
      include: [
        { model: Listing, as: 'listing' },
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to get landlord bookings' });
  }
};

// @desc    Update booking status
// @route   PATCH /api/bookings/:id/status
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByPk(req.params.id, {
      include: [{ model: Listing, as: 'listing' }]
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check if user is the landlord of the listing or an admin
    if (booking.listing.userId !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this booking' });
    }

    booking.status = status;
    await booking.save();

    res.json({ success: true, booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to update booking status' });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getLandlordBookings,
  updateBookingStatus
};

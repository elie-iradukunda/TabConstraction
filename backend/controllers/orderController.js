const { Order, Listing, User } = require('../models');

// @desc    Create an order
// @route   POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { listingId, quantity, totalPrice, shippingAddress } = req.body;
    
    // Check if listing exists and is a material
    const listing = await Listing.findByPk(listingId);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }
    
    if (listing.category !== 'material') {
      return res.status(400).json({ success: false, message: 'This listing is not a material to be ordered' });
    }

    const order = await Order.create({
      userId: req.user.id,
      listingId,
      quantity,
      totalPrice,
      shippingAddress
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
};

// @desc    Get user's orders
// @route   GET /api/orders/my-orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{ model: Listing, as: 'listing' }]
    });
    
    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to get orders' });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/admin
const getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: Listing, as: 'listing' },
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to get admin orders' });
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentInstructions, paymentDetails } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const isAdmin = req.user.role === 'admin' || req.user.role === 'manager';
    const isOwner = order.userId === req.user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this order' });
    }

    // Protect certain status and fields
    if (!isAdmin) {
      if (status && status !== 'payment_submitted') {
        return res.status(403).json({ success: false, message: 'Not authorized to set this order status' });
      }
      if (paymentInstructions !== undefined) {
        return res.status(403).json({ success: false, message: 'Not authorized to set payment instructions' });
      }
    }

    if (status) order.status = status;
    if (paymentInstructions !== undefined && isAdmin) order.paymentInstructions = paymentInstructions;
    if (paymentDetails !== undefined) order.paymentDetails = paymentDetails;
    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to update order status' });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAdminOrders,
  updateOrderStatus
};

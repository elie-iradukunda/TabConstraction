const { Listing, Image, User } = require('../models');
const { Op } = require('sequelize');

const getListings = async (req, res) => {
  try {
    const { category, type, minPrice, maxPrice, location, propertyType, search } = req.query;
    const where = {};

    if (category) where.category = category;
    if (type) where.type = type;
    if (propertyType) where.propertyType = propertyType;
    
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    if (location) {
      where.location = { [Op.like]: `%${location}%` };
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    // Default to active listings for non-admin/params
    if (!where.status) {
      where.status = 'active';
    }

    const listings = await Listing.findAll({
      where,
      include: [{ model: Image, as: 'images' }],
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, count: listings.length, listings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getListing = async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id, {
      include: [
        { model: Image, as: 'images' },
        { model: User, as: 'owner', attributes: ['name', 'email', 'phone'] }
      ]
    });

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.json({ success: true, listing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createListing = async (req, res) => {
  try {
    const { category } = req.body;
    const userRole = req.user.role;
    const userStatus = req.user.status;

    // Restriction: Only Admin and Manager can add construction materials
    if (category === 'material' && !['admin', 'manager'].includes(userRole)) {
      return res.status(403).json({ message: 'Only Admins and Managers can list construction materials.' });
    }

    // Role Workflow: Landlords must be approved to list anything
    if (userRole === 'landlord' && userStatus !== 'active') {
      return res.status(403).json({ message: 'Your landlord account is pending approval.' });
    }

    req.body.userId = req.user.id;
    
    // Auto-approve if created by admin/manager, otherwise default to pending (which is default in model anyway)
    if (['admin', 'manager'].includes(userRole)) {
      req.body.status = 'active';
    } else {
      req.body.status = 'pending';
    }

    const listing = await Listing.create(req.body);

    if (req.files && req.files.length > 0) {
      const images = req.files.map(file => ({
        imageUrl: `/uploads/${file.filename}`,
        listingId: listing.id
      }));
      await Image.bulkCreate(images);
    }

    const createdListing = await Listing.findByPk(listing.id, {
      include: [{ model: Image, as: 'images' }]
    });

    res.status(201).json({ success: true, listing: createdListing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateListing = async (req, res) => {
  try {
    let listing = await Listing.findByPk(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Make sure user is listing owner
    if (listing.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'User not authorized to update this listing' });
    }

    listing = await listing.update(req.body);

    if (req.files && req.files.length > 0) {
      const images = req.files.map(file => ({
        imageUrl: `/uploads/${file.filename}`,
        listingId: listing.id
      }));
      await Image.bulkCreate(images);
    }

    const updatedListing = await Listing.findByPk(listing.id, {
      include: [{ model: Image, as: 'images' }]
    });

    res.json({ success: true, listing: updatedListing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'User not authorized to delete this listing' });
    }

    await listing.destroy();

    res.json({ success: true, message: 'Listing removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyListings = async (req, res) => {
  try {
    const listings = await Listing.findAll({
      where: { userId: req.user.id },
      include: [{ model: Image, as: 'images' }]
    });
    res.json({ success: true, listings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAdminListings = async (req, res) => {
  try {
    const listings = await Listing.findAll({
      include: [
        { model: Image, as: 'images' },
        { model: User, as: 'owner', attributes: ['name', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, listings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateListingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const listing = await Listing.findByPk(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    await listing.update({ status });
    res.json({ success: true, listing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  getMyListings,
  getAdminListings,
  updateListingStatus
};

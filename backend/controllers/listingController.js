const { Listing, Image, User } = require('../models');
const { Op } = require('sequelize');
const cloudinary = require('../config/cloudinary');

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
    const userRole = req.user.role;

    // Restriction: Only Admin and Manager can add construction materials
    if (req.body.category === 'material' && !['admin', 'manager'].includes(userRole)) {
      return res.status(403).json({ message: 'Only Admins and Managers can list construction materials.' });
    }

    // Parse features if sent as JSON string from FormData
    let features = [];
    if (req.body.features && typeof req.body.features === 'string') {
      try { features = JSON.parse(req.body.features); } catch (e) { features = []; }
    } else if (Array.isArray(req.body.features)) {
      features = req.body.features;
    }

    // Explicitly pick only model-known fields to avoid Sequelize errors from stray FormData keys
    const listingData = {
      title:        req.body.title,
      description:  req.body.description,
      price:        parseFloat(req.body.price),
      location:     req.body.location,
      type:         req.body.type,
      category:     req.body.category,
      propertyType: req.body.propertyType || null,
      bedrooms:     parseInt(req.body.bedrooms) || 0,
      bathrooms:    parseInt(req.body.bathrooms) || 0,
      size:         req.body.size || null,
      mapLink:      req.body.mapLink || null,
      features,
      userId:       req.user.id,
      status:       ['admin', 'manager'].includes(userRole) ? 'active' : 'pending',
    };

    const listing = await Listing.create(listingData);

    if (req.files && req.files.length > 0) {
      const images = req.files.map(file => ({
        // If Cloudinary is used, file.path is the URL. 
        // If Local is used, we want to save /uploads/filename
        imageUrl: file.path.startsWith('http') ? file.path : `/uploads/${file.filename}`,
        listingId: listing.id
      }));
      await Image.bulkCreate(images);
    }

    const createdListing = await Listing.findByPk(listing.id, {
      include: [{ model: Image, as: 'images' }]
    });

    res.status(201).json({ success: true, listing: createdListing });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Make sure user is listing owner
    if (listing.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'User not authorized to update this listing' });
    }

    // Parse features if sent as JSON string from FormData
    let features = [];
    if (req.body.features && typeof req.body.features === 'string') {
      try { features = JSON.parse(req.body.features); } catch (e) { features = []; }
    } else if (Array.isArray(req.body.features)) {
      features = req.body.features;
    } else {
      features = listing.features; // Keep existing if not provided
    }

    // Explicitly pick fields to update to avoid issues with extraneous FormData fields
    const updateData = {
      title:        req.body.title || listing.title,
      description:  req.body.description || listing.description,
      price:        req.body.price ? parseFloat(req.body.price) : listing.price,
      location:     req.body.location || listing.location,
      type:         req.body.type || listing.type,
      category:     req.body.category || listing.category,
      propertyType: req.body.propertyType !== undefined ? req.body.propertyType : listing.propertyType,
      bedrooms:     req.body.bedrooms !== undefined ? parseInt(req.body.bedrooms) : listing.bedrooms,
      bathrooms:    req.body.bathrooms !== undefined ? parseInt(req.body.bathrooms) : listing.bathrooms,
      size:         req.body.size !== undefined ? req.body.size : listing.size,
      mapLink:      req.body.mapLink !== undefined ? req.body.mapLink : listing.mapLink,
      features,
    };

    await listing.update(updateData);

    // Handle new images if any
    if (req.files && req.files.length > 0) {
      const images = req.files.map(file => ({
        imageUrl: file.path.startsWith('http') ? file.path : `/uploads/${file.filename}`,
        listingId: listing.id
      }));
      await Image.bulkCreate(images);
    }

    const updatedListing = await Listing.findByPk(listing.id, {
      include: [{ model: Image, as: 'images' }]
    });

    res.json({ success: true, listing: updatedListing });
  } catch (error) {
    console.error('Update Listing Error:', error);
    res.status(500).json({ message: error.message });
  }
};

const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id, {
      include: [{ model: Image, as: 'images' }]
    });

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'User not authorized to delete this listing' });
    }

    // Clean up Cloudinary images when deleting a listing
    if (listing.images && listing.images.length > 0) {
      for (const img of listing.images) {
        try {
          const url = img.imageUrl;
          if (url && url.includes('cloudinary.com')) {
            const parts = url.split('/');
            const uploadIndex = parts.indexOf('upload');
            if (uploadIndex !== -1) {
              const afterUpload = parts.slice(uploadIndex + 2).join('/');
              const publicId = afterUpload.replace(/\.[^/.]+$/, '');
              await cloudinary.uploader.destroy(publicId);
            }
          }
        } catch (cloudErr) {
          console.error('Cloudinary delete error:', cloudErr.message);
        }
      }
    }

    await listing.destroy();

    res.json({ success: true, message: 'Listing removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteImage = async (req, res) => {
  try {
    const image = await Image.findByPk(req.params.imageId);

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Verify the user owns the listing this image belongs to
    const listing = await Listing.findByPk(image.listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    if (listing.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this image' });
    }

    // Delete from Cloudinary
    try {
      const url = image.imageUrl;
      if (url && url.includes('cloudinary.com')) {
        const parts = url.split('/');
        const uploadIndex = parts.indexOf('upload');
        if (uploadIndex !== -1) {
          const afterUpload = parts.slice(uploadIndex + 2).join('/');
          const publicId = afterUpload.replace(/\.[^/.]+$/, '');
          await cloudinary.uploader.destroy(publicId);
        }
      }
    } catch (cloudErr) {
      console.error('Cloudinary delete error:', cloudErr.message);
    }

    await image.destroy();

    res.json({ success: true, message: 'Image deleted' });
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
        { model: User, as: 'owner', attributes: ['name', 'email', 'phone'] }
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
const getDashboardStats = async (req, res) => {
  try {
    const { Op } = require('sequelize');
    const User = require('../models/User');

    // Listing counts
    const totalListings = await Listing.count();
    const activeListings = await Listing.count({ where: { status: 'active' } });
    const pendingListings = await Listing.count({ where: { status: 'pending' } });

    // By category
    const houses = await Listing.count({ where: { category: 'house' } });
    const land = await Listing.count({ where: { category: 'land' } });
    const materials = await Listing.count({ where: { category: 'material' } });

    // By type
    const forSale = await Listing.count({ where: { type: 'sale' } });
    const forRent = await Listing.count({ where: { type: 'rent' } });

    // User counts
    const totalUsers = await User.count();
    const admins = await User.count({ where: { role: 'admin' } });
    const managers = await User.count({ where: { role: 'manager' } });
    const landlords = await User.count({ where: { role: 'landlord' } });
    const normalUsers = await User.count({ where: { role: 'user' } });
    const pendingUsers = await User.count({ where: { status: 'pending' } });

    // Recent listings (last 5)
    const recentListings = await Listing.findAll({
      include: [{ model: User, as: 'owner', attributes: ['name'] }],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    // Recent users (last 5)
    const recentUsers = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    res.json({
      success: true,
      stats: {
        listings: { total: totalListings, active: activeListings, pending: pendingListings, houses, land, materials, forSale, forRent },
        users: { total: totalUsers, admins, managers, landlords, normalUsers, pending: pendingUsers },
        recentListings,
        recentUsers
      }
    });
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
  deleteImage,
  getMyListings,
  getAdminListings,
  updateListingStatus,
  getDashboardStats
};

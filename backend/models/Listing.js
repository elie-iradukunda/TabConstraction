const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Listing = sequelize.define('Listing', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('rent', 'sale'),
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('house', 'land', 'material'),
    allowNull: false
  },
  propertyType: {
    type: DataTypes.STRING, // Apartment, Villa, Plot, Cement, etc.
    allowNull: true
  },
  bedrooms: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  bathrooms: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  size: {
    type: DataTypes.STRING, // e.g., "1500 sqft" or "2 acres"
    allowNull: true
  },
  mapLink: {
    type: DataTypes.TEXT, // Google Maps URL pasted by landlord
    allowNull: true
  },
  features: {
    type: DataTypes.JSON, // e.g., ["Wifi", "Parking", "Security"]
    allowNull: true,
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('pending', 'active', 'rejected'),
    defaultValue: 'pending'
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true
  }
});

module.exports = Listing;

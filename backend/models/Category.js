const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  type: {
    type: DataTypes.ENUM('Property', 'Land', 'Material'),
    allowNull: false,
    defaultValue: 'Property'
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Layers'
  }
}, {
  timestamps: true
});

module.exports = Category;

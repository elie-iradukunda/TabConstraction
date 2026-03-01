const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  visitationDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  visitationTime: {
    type: DataTypes.STRING,
    allowNull: true
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'visited', 'approved', 'rejected', 'paid', 'completed'),
    defaultValue: 'pending'
  }
});

module.exports = Booking;

const { sequelize } = require('./config/db');
const { Category } = require('./models');
const dotenv = require('dotenv');

dotenv.config();

const init = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
    // Sync Category model
    await Category.sync({ alter: true });
    
    console.log('Ensuring essential categories exist...');
    await Category.bulkCreate([
      { name: 'house', type: 'Property', icon: 'Home' },
      { name: 'land', type: 'Land', icon: 'Mountain' },
      { name: 'material', type: 'Material', icon: 'ShoppingBag' },
      { name: 'Houses for Sale', type: 'Property', icon: 'Home' },
      { name: 'Houses for Rent', type: 'Property', icon: 'Home' },
      { name: 'Land & Plots', type: 'Land', icon: 'Mountain' },
      { name: 'Cement & Bricks', type: 'Material', icon: 'ShoppingBag' },
      { name: 'Steel & Metal', type: 'Material', icon: 'ShoppingBag' },
    ], { ignoreDuplicates: true });
    console.log('✅ Essential categories ensured.');
    
    process.exit(0);
  } catch (error) {
    console.error('Unable to connect or sync:', error);
    process.exit(1);
  }
};

init();

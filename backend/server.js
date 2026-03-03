const app = require('./app');
const { sequelize, connectDB } = require('./config/db');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    
    // Sync models - using alter: true to automatically update schema changes
    await sequelize.sync({ alter: true });
    console.log('Database synced');
    
    // Seed essential categories if they don't exist
    const { Category } = require('./models');
    const essentialCategories = [
      { name: 'house', type: 'Property', icon: 'Home' },
      { name: 'land', type: 'Land', icon: 'Mountain' },
      { name: 'material', type: 'Material', icon: 'ShoppingBag' }
    ];

    for (const cat of essentialCategories) {
      await Category.findOrCreate({
        where: { name: cat.name },
        defaults: cat
      });
    }
    console.log('✅ Essential categories verified');

    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();

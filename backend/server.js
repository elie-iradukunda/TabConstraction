const app = require('./app');
const { sequelize, connectDB } = require('./config/db');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    
    // Sync models - in production you might use migrations
    await sequelize.sync({ force: false }); // Change to true if you want to drop and recreate tables
    console.log('Database synced');

    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();

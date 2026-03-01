const User = require('./User');
const Listing = require('./Listing');
const Image = require('./Image');
const Favorite = require('./Favorite');
const Booking = require('./Booking');
const Order = require('./Order');

// User <-> Listing (One-to-Many)
User.hasMany(Listing, { foreignKey: 'userId', as: 'listings' });
Listing.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

// Listing <-> Image (One-to-Many)
Listing.hasMany(Image, { foreignKey: 'listingId', as: 'images' });
Image.belongsTo(Listing, { foreignKey: 'listingId' });

// User <-> Favorite <-> Listing (Many-to-Many)
User.hasMany(Favorite, { foreignKey: 'userId' });
Favorite.belongsTo(User, { foreignKey: 'userId' });

Listing.hasMany(Favorite, { foreignKey: 'listingId' });
Favorite.belongsTo(Listing, { foreignKey: 'listingId', as: 'listing' });

// User <-> Booking <-> Listing
User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Listing.hasMany(Booking, { foreignKey: 'listingId', as: 'bookings' });
Booking.belongsTo(Listing, { foreignKey: 'listingId', as: 'listing' });

// User <-> Order <-> Listing
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Listing.hasMany(Order, { foreignKey: 'listingId', as: 'orders' });
Order.belongsTo(Listing, { foreignKey: 'listingId', as: 'listing' });
const Category = require('./Category');

Category.hasMany(Listing, { foreignKey: 'category', sourceKey: 'name', as: 'listings' });
Listing.belongsTo(Category, { foreignKey: 'category', targetKey: 'name', as: 'categoryData' });

module.exports = {
  User,
  Listing,
  Image,
  Favorite,
  Booking,
  Order,
  Category
};

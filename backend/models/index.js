const User = require('./User');
const Listing = require('./Listing');
const Image = require('./Image');
const Favorite = require('./Favorite');

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

module.exports = {
  User,
  Listing,
  Image,
  Favorite
};

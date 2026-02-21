const { sequelize } = require('./config/db');
const { User, Listing, Image, Favorite } = require('./models');
const dotenv = require('dotenv');

dotenv.config();

const seedData = async () => {
  try {
    // 1. Clear existing data
    console.log('🗑️ Clearing existing data...');
    await sequelize.sync({ force: true });
    console.log('✅ Database cleared.');

    // 2. Create Users with new roles
    console.log('👤 Creating users...');
    const users = await User.bulkCreate([
      {
        name: 'Super Admin',
        email: 'admin@tabiconst.com',
        password: 'password123',
        phone: '+254700000001',
        role: 'admin',
        status: 'active'
      },
      {
        name: 'Platform Manager',
        email: 'manager@tabiconst.com',
        password: 'password123',
        phone: '+254700000002',
        role: 'manager',
        status: 'active'
      },
      {
        name: 'Verified Landlord',
        email: 'landlord@tabiconst.com',
        password: 'password123',
        phone: '+254700000003',
        role: 'landlord',
        status: 'active'
      },
      {
        name: 'Pending Landlord',
        email: 'newlandlord@tabiconst.com',
        password: 'password123',
        phone: '+254700000004',
        role: 'landlord',
        status: 'pending'
      },
      {
        name: 'Normal Customer',
        email: 'user@tabiconst.com',
        password: 'password123',
        phone: '+254700000005',
        role: 'user',
        status: 'active'
      }
    ], { individualHooks: true });
    console.log('✅ Users created.');

    const admin = users[0];
    const manager = users[1];
    const landlord = users[2];
    const customer = users[4];

    // 3. Create Listings
    console.log('🏠 Creating listings...');
    const listings = await Listing.bulkCreate([
      {
        userId: landlord.id,
        title: 'Modern 4 Bedroom Villa',
        description: 'Luxurious villa for sale by the owner.',
        price: 450000,
        location: 'Karen, Nairobi',
        type: 'sale',
        category: 'house',
        propertyType: 'Villa',
        bedrooms: 4,
        bathrooms: 3,
        size: '3500 sqft',
        status: 'active'
      },
      {
        userId: manager.id,
        title: 'Platform Managed Apartment',
        description: 'Quality apartment managed directly by our platform team.',
        price: 2500,
        location: 'Kilimani, Nairobi',
        type: 'rent',
        category: 'house',
        propertyType: 'Apartment',
        bedrooms: 2,
        bathrooms: 2,
        size: '1200 sqft',
        status: 'active'
      },
      {
        userId: admin.id,
        title: 'Premium Structural Steel Beams',
        description: 'Heavy duty steel beams for large scale construction.',
        price: 1500,
        location: 'Industrial Area',
        type: 'sale',
        category: 'material',
        propertyType: 'Steel',
        status: 'active'
      },
      {
        userId: landlord.id,
        title: 'Suburban Land Plot',
        description: 'Half-acre land plot in a quiet neighborhood.',
        price: 85000,
        location: 'Syokimau',
        type: 'sale',
        category: 'land',
        propertyType: 'Residential Plot',
        size: '0.5 Acres',
        status: 'pending' // Needs approval
      }
    ]);
    console.log('✅ Listings created.');

    // 4. Create Images
    console.log('🖼️ Creating images...');
    const imgData = [
      { listingId: listings[0].id, imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750' },
      { listingId: listings[1].id, imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688' },
      { listingId: listings[2].id, imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef' },
      { listingId: listings[3].id, imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef' }
    ];
    await Image.bulkCreate(imgData);
    console.log('✅ Images created.');

    console.log('\n🚀 SEEDING COMPLETED SUCCESSFULLY!');
    process.exit(0);
  } catch (error) {
    console.error('❌ SEEDING FAILED:', error);
    process.exit(1);
  }
};

seedData();

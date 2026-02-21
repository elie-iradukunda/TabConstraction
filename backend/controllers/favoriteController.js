const { Favorite, Listing, Image } = require('../models');

const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Listing,
          as: 'listing',
          include: [{ model: Image, as: 'images' }]
        }
      ]
    });
    res.json({ success: true, favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addFavorite = async (req, res) => {
  try {
    const { listingId } = req.body;
    
    const exists = await Favorite.findOne({
      where: { userId: req.user.id, listingId }
    });

    if (exists) {
      return res.status(400).json({ message: 'Already favorited' });
    }

    const favorite = await Favorite.create({
      userId: req.user.id,
      listingId
    });

    res.status(201).json({ success: true, favorite });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    await favorite.destroy();
    res.json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite
};

import React from 'react';
import { Heart, Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

const Favorites = () => {
  // Logic for favorites would go here (fetch from favoriteStore/listingStore)
  // For now, providing a premium placeholder UI
  const favorites = []; 

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-black text-dark font-poppins mb-2">My Favorites</h1>
        <p className="text-gray-500 font-medium">Keep track of the properties and materials you love.</p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Mapping would happen here */}
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-20 text-center">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
             <Heart size={40} className="text-red-500" fill="currentColor" />
          </div>
          <h2 className="text-2xl font-black text-dark mb-4 font-poppins">Nothing saved yet</h2>
          <p className="text-gray-500 mb-10 max-w-sm mx-auto font-medium">Click the heart icon on any listing to save it here for quick access later.</p>
          <Link 
            to="/listings" 
            className="btn-primary inline-flex items-center gap-3 px-10 rounded-2xl shadow-xl shadow-primary/20 group"
          >
            <span>Browse Listings</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default Favorites;

import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Move, Tag } from 'lucide-react';

const ListingCard = ({ listing }) => {
  const { id, title, price, location, type, category, bedrooms, bathrooms, size, images } = listing;
  
  const mainImage = images && images.length > 0 
    ? (images[0].imageUrl.startsWith('http') ? images[0].imageUrl : `http://localhost:5000${images[0].imageUrl}`)
    : 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800';

  return (
    <div className="card group">
      <Link to={`/listings/${id}`}>
        <div className="relative h-64 overflow-hidden">
          <img 
            src={mainImage} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm ${type === 'sale' ? 'bg-orange-500' : 'bg-blue-500'}`}>
              FOR {type.toUpperCase()}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold text-white bg-dark/70 shadow-sm backdrop-blur-sm">
              {category.toUpperCase()}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-dark group-hover:text-primary transition-colors line-clamp-1">{title}</h3>
            <span className="text-xl font-black text-primary font-poppins">${Number(price).toLocaleString()}</span>
          </div>
          
          <div className="flex items-center text-gray-400 text-sm mb-6">
            <MapPin size={16} className="mr-1" />
            <span className="line-clamp-1">{location}</span>
          </div>
          
          {category === 'house' && (
            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Bed size={18} className="text-primary" />
                <span className="font-bold text-sm">{bedrooms} Beds</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Bath size={18} className="text-primary" />
                <span className="font-bold text-sm">{bathrooms} Baths</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Move size={18} className="text-primary" />
                <span className="font-bold text-sm">{size}</span>
              </div>
            </div>
          )}

          {category !== 'house' && size && (
             <div className="flex items-center gap-2 text-gray-600 border-t border-gray-100 pt-4">
                <Tag size={18} className="text-primary" />
                <span className="font-bold text-sm">{size}</span>
             </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ListingCard;

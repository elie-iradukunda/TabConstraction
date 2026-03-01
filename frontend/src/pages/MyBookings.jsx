import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Clock, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/bookings/my-bookings');
        setBookings(response.data.bookings || []);
      } catch (error) {
        console.error('Failed to fetch bookings', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'approved': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'visited': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'paid': 
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-black text-dark tracking-tight font-poppins">My Visitings</h1>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
            <Calendar size={32} />
          </div>
          <h2 className="text-xl font-bold text-dark mb-2">No Visitings Yet</h2>
          <p className="text-gray-500 mb-6 max-w-md">You haven't scheduled any house visits yet. Browse the marketplace and book a visit to find your perfect home.</p>
          <Link to="/listings?type=rent" className="btn-primary px-8">Browse Houses</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                 <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border ${getStatusColor(booking.status)}`}>
                   {booking.status}
                 </span>
                 <span className="text-xs font-bold text-gray-400">
                   {new Date(booking.createdAt).toLocaleDateString()}
                 </span>
              </div>
              
              <Link to={`/listings/${booking.listing?.id}`} className="mb-4 group">
                <h3 className="text-lg font-black text-dark group-hover:text-primary transition-colors line-clamp-1">{booking.listing?.title || 'Unknown Property'}</h3>
                <div className="flex items-center gap-1.5 text-gray-500 mt-1">
                  <MapPin size={14} />
                  <span className="text-sm font-medium truncate">{booking.listing?.location}</span>
                </div>
              </Link>
              
              <div className="mt-auto space-y-3 pt-4 border-t border-gray-50">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-500 font-bold">
                    <Calendar size={16} /> Date
                  </div>
                  <span className="font-bold text-dark">{booking.visitationDate}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-500 font-bold">
                    <Clock size={16} /> Time
                  </div>
                  <span className="font-bold text-dark">{booking.visitationTime}</span>
                </div>
                {booking.message && (
                  <div className="bg-gray-50 p-3 rounded-xl mt-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 mb-1">
                      <Info size={12} /> My Message
                    </div>
                    <p className="text-sm text-gray-700 italic">"{booking.message}"</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;

import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Clock, Info, Check, X, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const LandlordVisitings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/landlord');
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error('Failed to fetch landlord bookings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await api.patch(`/bookings/${id}/status`, { status: newStatus });
      setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } catch (error) {
      console.error('Failed to update status', error);
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-black text-dark tracking-tight font-poppins">Requested Visitings</h1>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
            <Calendar size={32} />
          </div>
          <h2 className="text-xl font-bold text-dark mb-2">No Requests Yet</h2>
          <p className="text-gray-500 mb-6 max-w-md">You haven't received any house visitation requests from users yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                 <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border ${getStatusColor(booking.status)}`}>
                   {booking.status}
                 </span>
                 <span className="text-xs font-bold text-gray-400">
                   Requested: {new Date(booking.createdAt).toLocaleDateString()}
                 </span>
              </div>
              
              <Link to={`/listings/${booking.listing?.id}`} className="mb-4 group">
                <h3 className="text-lg font-black text-dark group-hover:text-primary transition-colors line-clamp-1">{booking.listing?.title}</h3>
                <div className="flex items-center gap-1.5 text-gray-500 mt-1">
                  <MapPin size={14} />
                  <span className="text-sm font-medium truncate">{booking.listing?.location}</span>
                </div>
              </Link>

              <div className="bg-blue-50/50 rounded-xl p-4 mb-4 border border-blue-100/50">
                <h4 className="text-xs font-black text-blue-900 mb-2 uppercase tracking-wider">Client Details</h4>
                <div className="space-y-2">
                  <div className="font-bold text-dark text-sm">{booking.user?.name}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail size={14} /> {booking.user?.email}
                  </div>
                  {booking.user?.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={14} /> {booking.user?.phone}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-3 pt-4 border-t border-gray-50">
                <div className="flex items-center justify-between text-sm py-1">
                  <div className="flex items-center gap-2 text-gray-500 font-bold">
                    <Calendar size={16} /> Date
                  </div>
                  <span className="font-bold text-dark">{booking.visitationDate}</span>
                </div>
                <div className="flex items-center justify-between text-sm py-1">
                  <div className="flex items-center gap-2 text-gray-500 font-bold">
                    <Clock size={16} /> Time
                  </div>
                  <span className="font-bold text-dark">{booking.visitationTime}</span>
                </div>
                {booking.message && (
                  <div className="bg-gray-50 p-3 rounded-xl mt-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 mb-1">
                      <Info size={12} /> Message
                    </div>
                    <p className="text-sm text-gray-700 italic">"{booking.message}"</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                <select 
                  className="input-field py-2 text-sm font-bold flex-grow min-w-[140px]"
                  value={booking.status}
                  onChange={(e) => handleUpdateStatus(booking.id, e.target.value)}
                  disabled={updatingId === booking.id}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="visited">Visited</option>
                  <option value="paid">Paid</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
                {updatingId === booking.id && (
                  <div className="flex justify-center items-center w-10">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
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

export default LandlordVisitings;

import React, { useEffect, useState } from 'react';
import { Package, MapPin, Mail, Phone, CreditCard, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paymentInstructions, setPaymentInstructions] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/admin');
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Failed to fetch admin orders', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await api.patch(`/orders/${id}/status`, { status: newStatus });
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error('Failed to update status', error);
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSendPaymentRequest = async (e) => {
    e.preventDefault();
    setUpdatingId(selectedOrder.id);
    try {
      await api.patch(`/orders/${selectedOrder.id}/status`, { 
        status: 'payment_requested',
        paymentInstructions: paymentInstructions 
      });
      setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, status: 'payment_requested', paymentInstructions } : o));
      setShowRequestModal(false);
      setPaymentInstructions('');
    } catch (error) {
      console.error('Failed to send payment request', error);
      alert('Failed to send payment request');
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
      case 'payment_requested': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'payment_submitted': return 'bg-teal-100 text-teal-700 border-teal-200 animate-pulse border-2';
      case 'paid': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-black text-dark tracking-tight font-poppins">Manage Material Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-6">
            <Package size={32} />
          </div>
          <h2 className="text-xl font-bold text-dark mb-2">No Orders Yet</h2>
          <p className="text-gray-500 mb-6 max-w-md">There are currently no material orders on the platform.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                 <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                   {order.status}
                 </span>
                 <span className="text-xs font-bold text-gray-400">
                   Ordered: {new Date(order.createdAt).toLocaleDateString()}
                 </span>
              </div>
              
              <Link to={`/listings/${order.listing?.id}`} className="mb-4 group">
                <h3 className="text-lg font-black text-dark group-hover:text-primary transition-colors line-clamp-1">{order.listing?.title}</h3>
                <div className="text-2xl font-black text-primary mt-1">
                  {Number(order.totalPrice).toLocaleString()} RWF
                </div>
              </Link>

              <div className="bg-orange-50/50 rounded-xl p-4 mb-4 border border-orange-100/50">
                <h4 className="text-xs font-black text-orange-900 mb-2 uppercase tracking-wider">Customer Details</h4>
                <div className="space-y-2">
                  <div className="font-bold text-dark text-sm">{order.user?.name}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail size={14} /> {order.user?.email}
                  </div>
                  {order.user?.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={14} /> {order.user?.phone}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-3 pt-4 border-t border-gray-50">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-gray-500 font-bold">Quantity Ordered</div>
                  <span className="font-black text-dark bg-gray-100 px-3 py-1 rounded-lg">{order.quantity} Units</span>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-xl mt-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 mb-1">
                    <MapPin size={12} /> Delivery Address
                  </div>
                  <p className="text-sm text-gray-700 font-medium whitespace-pre-line">{order.shippingAddress}</p>
                </div>

                {order.paymentDetails && (
                  <div className="bg-teal-50/50 p-4 rounded-xl mt-2 border border-teal-100">
                    <div className="flex items-center gap-1.5 text-xs font-black text-teal-800 mb-2 uppercase tracking-wide">
                      <CreditCard size={14} /> Payment Evidence Review
                    </div>
                    <p className="text-sm text-teal-900 font-medium whitespace-pre-line leading-relaxed">{order.paymentDetails}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                {order.status === 'pending' ? (
                  <button 
                    onClick={() => { setSelectedOrder(order); setShowRequestModal(true); setPaymentInstructions(''); }}
                    className="w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-md font-black text-sm"
                  >
                    <CreditCard size={18} /> Send Payment Request
                  </button>
                ) : (
                  <select 
                    className={`input-field py-2 text-sm font-bold flex-grow min-w-[140px] ${order.status === 'payment_submitted' ? 'border-teal-400 focus:border-teal-500 bg-teal-50' : ''}`}
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                    disabled={updatingId === order.id}
                  >
                    <option value="payment_requested">Payment Requested</option>
                    <option value="payment_submitted">Verifying Payment</option>
                    <option value="paid">Approve: Mark as Paid</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                )}
                {updatingId === order.id && (
                  <div className="flex justify-center items-center w-10">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin Request Payment Modal */}
      {showRequestModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-xl font-black font-poppins text-dark">Request Payment</h3>
              <button 
                onClick={() => setShowRequestModal(false)} 
                className="text-gray-400 hover:text-dark hover:bg-gray-100 p-2 rounded-xl transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 md:p-8 space-y-6">
              <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100">
                <div className="text-sm text-gray-500 font-bold mb-1 uppercase tracking-wider">Order Value</div>
                <div className="text-3xl font-black text-primary mb-1">{Number(selectedOrder.totalPrice).toLocaleString()} RWF</div>
                <div className="text-xs text-orange-800 font-bold">Approve this order by sending payment instructions to the customer.</div>
              </div>

              <form onSubmit={handleSendPaymentRequest} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Custom Payment Instructions (Mobile Money, MoMo, BK, etc.)</label>
                  <textarea 
                    className="input-field min-h-[140px]"
                    placeholder="E.g., Please dial *182# and pay via MoMo to 078XXXXXXX using your Order ID as reference."
                    required
                    value={paymentInstructions}
                    onChange={(e) => setPaymentInstructions(e.target.value)}
                  />
                  <p className="text-xs font-bold text-gray-400">The customer will see this message directly in their dashboard to complete the payment securely.</p>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowRequestModal(false)}
                    className="btn-secondary w-full py-4 rounded-xl flex-1 font-black"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={updatingId === selectedOrder.id}
                    className="btn-primary w-full py-4 rounded-xl flex-[2] bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 border-none font-black shadow-xl shadow-orange-500/30 disabled:opacity-50"
                  >
                    {updatingId === selectedOrder.id ? 'Sending...' : 'Send Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;

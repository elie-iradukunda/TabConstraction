import React, { useEffect, useState } from 'react';
import { Package, MapPin, Search, CreditCard, X, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paymentDetailsText, setPaymentDetailsText] = useState('');
  const [submittingPayment, setSubmittingPayment] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders/my-orders');
        setOrders(response.data.orders || []);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleSubmitPaymentDetails = async (e) => {
    e.preventDefault();
    setSubmittingPayment(true);
    try {
      await api.patch(`/orders/${selectedOrder.id}/status`, { 
        status: 'payment_submitted',
        paymentDetails: paymentDetailsText 
      });
      setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, status: 'payment_submitted', paymentDetails: paymentDetailsText } : o));
      setShowPaymentModal(false);
      setPaymentDetailsText('');
    } catch (error) {
      console.error('Failed to submit payment details', error);
      alert('Failed to submit payment details');
    } finally {
      setSubmittingPayment(false);
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
      case 'payment_submitted': return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'paid': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-black text-dark tracking-tight font-poppins">My Material Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-6">
            <Package size={32} />
          </div>
          <h2 className="text-xl font-bold text-dark mb-2">No Orders Yet</h2>
          <p className="text-gray-500 mb-6 max-w-md">You haven't placed any material orders yet. Browse our materials and start building!</p>
          <Link to="/listings?category=material" className="btn-primary px-8 bg-orange-500 hover:bg-orange-600 border-orange-500">Shop Materials</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                 <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                   {order.status}
                 </span>
                 <span className="text-xs font-bold text-gray-400">
                   {new Date(order.createdAt).toLocaleDateString()}
                 </span>
              </div>
              
              <Link to={`/listings/${order.listing?.id}`} className="mb-4 group">
                <h3 className="text-lg font-black text-dark group-hover:text-primary transition-colors line-clamp-1">{order.listing?.title || 'Unknown Material'}</h3>
                <div className="text-2xl font-black text-primary mt-1">
                  {Number(order.totalPrice).toLocaleString()} RWF
                </div>
              </Link>
              
              <div className="mt-auto space-y-3 pt-4 border-t border-gray-50">
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

                {order.status === 'payment_requested' && (
                  <button 
                    onClick={() => { setSelectedOrder(order); setPaymentDetailsText(''); setShowPaymentModal(true); }}
                    className="w-full mt-3 btn-primary py-3 rounded-xl flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md transition-all font-black text-sm animate-pulse"
                  >
                    <CreditCard size={18} /> Complete Payment
                  </button>
                )}
                {order.status === 'payment_submitted' && (
                  <div className="w-full mt-3 py-3 rounded-xl flex items-center justify-center gap-2 bg-teal-50 text-teal-700 border border-teal-100 font-bold text-sm">
                    Verifying Payment...
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payment Instructions Modal */}
      {showPaymentModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-xl font-black font-poppins text-dark">Make a Payment</h3>
              <button 
                onClick={() => setShowPaymentModal(false)} 
                className="text-gray-400 hover:text-dark hover:bg-gray-100 p-2 rounded-xl transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto space-y-6">
              
              <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
                <div className="text-sm text-gray-500 font-bold mb-1 uppercase tracking-wider">Total Amount Due</div>
                <div className="text-3xl font-black text-primary mb-3">{Number(selectedOrder.totalPrice).toLocaleString()} RWF</div>
                <div className="text-sm text-blue-800 flex items-start gap-2 bg-white/60 p-3 rounded-xl">
                  <Info size={18} className="flex-shrink-0 mt-0.5 text-blue-500" />
                  <span className="font-medium">Once your payment is made, our admins will manually verify it and update your order status to <strong>Paid</strong> or <strong>Shipped</strong>.</span>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-black text-dark text-base uppercase tracking-tight">Step 1: Follow Instructions</h4>
                
                <div className="border border-gray-200 rounded-2xl p-5 bg-orange-50/50 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                  <p className="text-gray-700 font-medium whitespace-pre-line leading-relaxed">
                    {selectedOrder.paymentInstructions || "Please wait for payment instructions."}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmitPaymentDetails} className="space-y-4">
                <h4 className="font-black text-dark text-base uppercase tracking-tight">Step 2: Submit Details</h4>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Payment Evidence (Phone Number used, Transaction ID, etc.)</label>
                  <textarea 
                    className="input-field min-h-[100px]"
                    placeholder="E.g., I paid using MTN MoMo from 078XXXXXXX. Reference number is XXXX."
                    required
                    value={paymentDetailsText}
                    onChange={(e) => setPaymentDetailsText(e.target.value)}
                  />
                </div>
                
                <div className="pt-2 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="btn-secondary w-full py-4 rounded-xl flex-1 font-black"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={submittingPayment}
                    className="btn-primary w-full py-4 rounded-xl flex-[2] bg-gradient-to-r from-blue-600 to-blue-700 font-black shadow-xl shadow-blue-500/20 disabled:opacity-50"
                  >
                    {submittingPayment ? 'Submitting...' : 'Submit Payment Details'}
                  </button>
                </div>
              </form>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs text-center text-gray-500 font-bold uppercase tracking-widest">
                Need help? <a href="mailto:support@tabiconst.com" className="text-blue-600 hover:underline">support@tabiconst.com</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;

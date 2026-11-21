import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock, CheckCircle, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, coupon, subtotal, discountAmount, taxAmount, shippingAmount, finalTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [processing, setProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    street: user?.addresses?.[0]?.street || '123 Innovation Boulevard',
    city: user?.addresses?.[0]?.city || 'Mumbai',
    state: user?.addresses?.[0]?.state || 'Maharashtra',
    zipCode: user?.addresses?.[0]?.zipCode || '400001',
    country: 'India'
  });
  const [guestInfo, setGuestInfo] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'customer@colorlex.com',
    phone: user?.phone || '+91 98765 43210'
  });
  const [paymentMethod, setPaymentMethod] = useState('stripe_mock');

  const inputCls = "w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition";

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const payload = { items: cartItems, shippingAddress, paymentMethod, couponCode: coupon?.code || '', guestInfo: user ? undefined : guestInfo };
      const res = await apiFetch('/orders', { method: 'POST', body: JSON.stringify(payload) });
      if (res.success) { setCompletedOrder(res.data); clearCart(); }
    } catch (err) { alert(err.message || 'Order creation failed'); }
    finally { setProcessing(false); }
  };

  if (completedOrder) {
    return (
      <div className="mx-5 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-gray-900">Payment Successful & Order Confirmed!</h1>
        <p className="text-gray-500 text-sm">
          Thank you for choosing ColorLex Creation. Your order number is <strong className="text-purple-600 font-mono text-base">{completedOrder.orderNumber}</strong>.
        </p>
        <div className="bg-white border border-gray-200 p-6 rounded-2xl text-left text-xs space-y-2 shadow-sm">
          <h3 className="font-bold text-gray-700 uppercase tracking-wider text-[11px] mb-2">Order Summary Details</h3>
          <div>Total Amount Paid: <span className="font-bold text-emerald-600">₹{completedOrder.finalAmount?.toFixed(2)}</span></div>
          <div>Payment Gateway: <span className="font-semibold text-gray-700 uppercase">{completedOrder.paymentMethod}</span></div>
          <div>Initial Pipeline Status: <span className="font-bold text-amber-500">Pending → Design Review</span></div>
        </div>
        <button onClick={() => navigate('/account')} className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-purple-300/30">
          Track Order & Proof Approvals
        </button>
      </div>
    );
  }

  return (
    <div className="mx-5 py-10 space-y-8">
      <h1 className="text-3xl font-black text-gray-900 tracking-tight">Checkout & Payment Gateway</h1>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          {!user && (
            <div className="bg-white border border-gray-200 p-6 rounded-2xl space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">1. Contact Information (Guest Checkout)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="text" required value={guestInfo.name} onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })} placeholder="Full Name" className={inputCls} />
                <input type="email" required value={guestInfo.email} onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })} placeholder="Email Address" className={inputCls} />
              </div>
            </div>
          )}

          <div className="bg-white border border-gray-200 p-6 rounded-2xl space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4 text-purple-500" />
              {user ? '1.' : '2.'} Delivery Shipping Address
            </h3>
            <div className="space-y-3">
              <input type="text" required value={shippingAddress.street} onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })} placeholder="Street Address, Flat / Suite #" className={inputCls} />
              <div className="grid grid-cols-3 gap-3">
                <input type="text" required value={shippingAddress.city} onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })} placeholder="City" className={inputCls} />
                <input type="text" required value={shippingAddress.state} onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })} placeholder="State" className={inputCls} />
                <input type="text" required value={shippingAddress.zipCode} onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })} placeholder="PIN Code" className={inputCls} />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-6 rounded-2xl space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-purple-500" />
              {user ? '2.' : '3.'} Payment Gateway Integration
            </h3>
            <div className="space-y-3">
              {[
                { value: 'stripe_mock', title: 'Stripe Secure Card Payment', sub: 'Visa, Mastercard, American Express, Apple Pay' },
                { value: 'razorpay_mock', title: 'Razorpay Instant UPI & Netbanking', sub: 'Google Pay, PhonePe, Paytm, HDFC, ICICI' },
              ].map(opt => (
                <label key={opt.value} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === opt.value ? 'bg-purple-50 border-purple-400' : 'bg-gray-50 border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center space-x-3">
                    <input type="radio" name="payment" value={opt.value} checked={paymentMethod === opt.value} onChange={() => setPaymentMethod(opt.value)} className="text-purple-600" />
                    <div>
                      <span className="font-bold text-gray-900 text-xs block">{opt.title}</span>
                      <span className="text-[11px] text-gray-400">{opt.sub}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-gray-200 p-6 rounded-2xl space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">Cart Summary ({cartItems.length} items)</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-xs">
                  <div>
                    <span className="font-bold text-gray-800 block">{item.title}</span>
                    <span className="text-[10px] text-gray-400">{item.quantity} units</span>
                  </div>
                  <span className="font-bold text-gray-900">₹{item.calculatedPrice?.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              {discountAmount > 0 && <div className="flex justify-between text-emerald-600 font-semibold"><span>Discount</span><span>-₹{discountAmount.toFixed(2)}</span></div>}
              <div className="flex justify-between text-gray-500"><span>18% GST</span><span>₹{taxAmount.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-500"><span>Shipping</span><span>{shippingAmount === 0 ? 'FREE' : `₹${shippingAmount}`}</span></div>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-xl font-black text-gray-900">
              <span>Total Payable</span>
              <span className="text-purple-600">₹{finalTotal.toFixed(2)}</span>
            </div>
            <button type="submit" disabled={processing}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold py-4 rounded-xl shadow-lg shadow-purple-300/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50">
              <Lock className="w-4 h-4" />
              <span>{processing ? 'Processing Payment Gateway...' : 'Pay & Complete Order'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, coupon, applyCoupon, removeCoupon, subtotal, discountAmount, taxAmount, shippingAmount, finalTotal } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [applying, setApplying] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput) return;
    setApplying(true);
    try { await applyCoupon(couponInput); setCouponInput(''); }
    catch (err) { setCouponError(err.message || 'Invalid coupon code'); }
    finally { setApplying(false); }
  };

  if (cartItems.length === 0) {
    return (
      <div className="mx-5 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center mx-auto border border-purple-200">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-gray-900">Your Print Cart is Empty</h1>
        <p className="text-gray-400 text-sm">Choose from business cards, banners, flyers, or custom apparel in our catalog.</p>
        <Link to="/catalog" className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-purple-300/30">
          <span>Explore Print Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-5 py-10 space-y-8">
      <h1 className="text-3xl font-black text-gray-900 tracking-tight">Shopping Cart ({cartItems.length} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1">
                <h3 className="font-bold text-gray-900 text-base">{item.title}</h3>
                <div className="text-xs text-gray-400 space-y-0.5">
                  <div>Size: <span className="text-gray-700">{item.variantSelections?.size}</span></div>
                  <div>Material: <span className="text-gray-700">{item.variantSelections?.material}</span></div>
                  <div>Finish: <span className="text-gray-700">{item.variantSelections?.finish}</span></div>
                  <div>Turnaround: <span className="text-gray-700">{item.variantSelections?.turnaround}</span></div>
                </div>
                {item.artworkUrl && (
                  <span className="inline-block text-[11px] font-bold text-purple-600 mt-1">
                    📎 {item.artworkUrl === 'REQUEST_CUSTOM_DESIGN' ? 'Custom Design Assistance Requested' : 'Print Artwork File Attached'}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-6 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-xl px-2 py-1">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 rounded text-gray-400 hover:text-gray-900 font-bold text-xs">-</button>
                  <span className="text-xs font-bold text-gray-900 px-2">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 rounded text-gray-400 hover:text-gray-900 font-bold text-xs">+</button>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-gray-900 block">₹{item.calculatedPrice?.toFixed(2)}</span>
                  <button onClick={() => removeFromCart(item.id)} className="text-[11px] text-rose-500 hover:underline flex items-center gap-1 mt-0.5 ml-auto">
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4 space-y-6">
          {/* Coupon */}
          <div className="bg-white border border-gray-200 p-5 rounded-2xl space-y-3 shadow-sm">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-purple-600 flex items-center gap-1.5">
              <Tag className="w-4 h-4" /> Apply Promo Code
            </h3>
            {coupon ? (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-700">
                <div>
                  <span className="font-bold">{coupon.code}</span> applied!
                  <span className="block text-[11px] text-emerald-600 font-semibold">-₹{discountAmount.toFixed(2)} Discount</span>
                </div>
                <button onClick={removeCoupon} className="text-rose-500 text-xs font-bold hover:underline">Remove</button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="e.g. COLORLEX15"
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 uppercase focus:outline-none focus:border-purple-500"
                  />
                  <button type="submit" disabled={applying} className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors">
                    {applying ? '...' : 'Apply'}
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-rose-500">{couponError}</p>}
              </form>
            )}
          </div>

          {/* Summary */}
          <div className="bg-white border border-gray-200 p-6 rounded-2xl space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">Order Summary</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              {discountAmount > 0 && <div className="flex justify-between text-emerald-600 font-semibold"><span>Coupon Discount</span><span>-₹{discountAmount.toFixed(2)}</span></div>}
              <div className="flex justify-between text-gray-500"><span>18% GST Tax</span><span>₹{taxAmount.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-500">
                <span>Standard Shipping</span>
                <span>{shippingAmount === 0 ? <strong className="text-emerald-600 uppercase">FREE</strong> : `₹${shippingAmount}`}</span>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-lg font-black text-gray-900">
              <span>Final Total</span>
              <span className="text-purple-600">₹{finalTotal.toFixed(2)}</span>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-purple-300/30 flex items-center justify-center space-x-2 transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

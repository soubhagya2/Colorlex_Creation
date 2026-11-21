import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../services/api';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('colorlex_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [coupon, setCoupon] = useState(null);

  useEffect(() => {
    localStorage.setItem('colorlex_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (newItem) => {
    const itemKey = `${newItem.product}-${JSON.stringify(newItem.variantSelections)}`;
    setCartItems(prev => {
      const existingIdx = prev.findIndex(item => item.itemKey === itemKey);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += newItem.quantity;
        updated[existingIdx].calculatedPrice += newItem.calculatedPrice;
        return updated;
      }
      return [...prev, { ...newItem, itemKey, id: Date.now().toString() }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return removeFromCart(id);
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const unitPrice = item.unitPrice || (item.calculatedPrice / item.quantity);
        return {
          ...item,
          quantity: newQty,
          calculatedPrice: unitPrice * newQty
        };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCartItems([]);
    setCoupon(null);
  };

  const applyCoupon = async (code) => {
    const subtotal = cartItems.reduce((acc, i) => acc + i.calculatedPrice, 0);
    try {
      const res = await apiFetch('/coupons/validate', {
        method: 'POST',
        body: JSON.stringify({ code, cartTotal: subtotal })
      });
      if (res.success) {
        setCoupon(res.data);
        return res.data;
      }
    } catch (err) {
      throw err;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.calculatedPrice, 0);
  const discountAmount = coupon ? coupon.calculatedDiscount || 0 : 0;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = taxableAmount * 0.18;
  const shippingAmount = subtotal > 2000 || subtotal === 0 ? 0 : 150;
  const finalTotal = taxableAmount + taxAmount + shippingAmount;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        coupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        discountAmount,
        taxAmount,
        shippingAmount,
        finalTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

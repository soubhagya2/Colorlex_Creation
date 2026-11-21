import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './components/admin/AdminLayout';

// Storefront pages
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Services from './pages/Services';
import ProductDetail from './pages/ProductDetail';
import CustomDesignRequest from './pages/CustomDesignRequest';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Account from './pages/Account';
import Login from './pages/Login';
import ProofApproval from './pages/ProofApproval';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Terms from './pages/Terms';
import ShippingPolicy from './pages/ShippingPolicy';
import Hero from './pages/Hero';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminDesignQueue from './pages/admin/AdminDesignQueue';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminCMS from './pages/admin/AdminCMS';
import AdminReports from './pages/admin/AdminReports';

export default function App() {
  return (
    <Routes>
      {/* Storefront Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="services" element={<Services />} />
        <Route path="product/:slug" element={<ProductDetail />} />
        <Route path="custom-design" element={<CustomDesignRequest />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="login" element={<Login />} />
        <Route path="account" element={<Account />} />
        <Route path="proof/:requestId" element={<ProofApproval />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="terms" element={<Terms />} />
        <Route path="shipping-policy" element={<ShippingPolicy />} />
        <Route path="hero" element={<Hero />} />
      </Route>

      {/* Admin Standalone Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Protected Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="design-queue" element={<AdminDesignQueue />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="coupons" element={<AdminCoupons />} />
        <Route path="cms" element={<AdminCMS />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>

      {/* Fallback Catch-All Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import CartDrawer from './components/user/CartDrawer';

import Home from './pages/user/Home';
import RestaurantDetail from './pages/user/RestaurantDetail';
import OrderHistory from './pages/user/OrderHistory';
import OrderSuccess from './pages/user/OrderSuccess';
import AdminDashboard from './pages/admin/AdminDashboard';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-dark-900 text-slate-100 selection:bg-brand-500 selection:text-white">
        <Navbar />
        <CartDrawer />
        
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 pt-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/restaurant/:id" element={<RestaurantDetail />} />
            <Route path="/my-orders" element={<OrderHistory />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

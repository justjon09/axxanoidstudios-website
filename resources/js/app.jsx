import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Work from './pages/Work';
import Services from './pages/Services';
import Products from './pages/Products';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="work" element={<Work />} />
          <Route path="services" element={<Services />} />
          <Route path="products" element={<Products />} />
          <Route path="contact" element={<Contact />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="*" element={<div className="text-center py-20 font-mono text-slate-500">404 // ROUTE_NOT_FOUND</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
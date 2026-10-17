import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import Layout from './components/Layout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import DynamicContent from './pages/Admin/DynamicContent';
import EntryEditor from './pages/Admin/EntryEditor';
import EntryList from './pages/Admin/EntryList';
import LeadList from './pages/Admin/LeadList';
import SchemaBuilder from './pages/Admin/SchemaBuilder';
import Home from './pages/Home';
import Work from './pages/Work';
import Services from './pages/Services';
import Products from './pages/Products';
import Contact from './pages/Contact';

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
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="schemas" element={<SchemaBuilder />} />
            <Route path="entries/:schemaSlug" element={<EntryList />} />
            <Route path="entries/:schemaSlug/new" element={<EntryEditor />} />
            <Route path="entries/:schemaSlug/:id" element={<EntryEditor />} />
            <Route path="leads" element={<LeadList />} />
            <Route path="dynamic-content" element={<DynamicContent />} />
          </Route>
          <Route path="*" element={<div className="text-center py-20 font-mono text-slate-500">404 // ROUTE_NOT_FOUND</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
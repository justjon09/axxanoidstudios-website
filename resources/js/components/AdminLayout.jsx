import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="flex">
      <div className="w-64 bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold mb-4">Admin</h1>
        <ul>
          <li><a href="/admin" className="block py-2 px-4 hover:bg-gray-700">Dashboard</a></li>
          <li><a href="/admin/schemas" className="block py-2 px-4 hover:bg-gray-700">Schema Builder</a></li>
          <li><a href="/admin/leads" className="block py-2 px-4 hover:bg-gray-700">Inbound Leads</a></li>
          <li><a href="/admin/dynamic-content" className="block py-2 px-4 hover:bg-gray-700">Dynamic Content</a></li>
        </ul>
      </div>
      <div className="flex-1 p-4">
        <header className="flex justify-between items-center mb-4">
          <nav>
            <ol className="breadcrumb">
              <li><a href="/">Home</a></li>
              <li className="breadcrumb-item active">Admin</li>
            </ol>
          </nav>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
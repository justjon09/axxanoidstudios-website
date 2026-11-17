import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const match = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'));
      const xsrfToken = match ? decodeURIComponent(match[2]) : '';

      const response = await fetch('/api/admin/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-XSRF-TOKEN': xsrfToken,
        },
        credentials: 'include',
      });

      if (response.ok) {
        navigate('/admin/login');
      } else {
        console.error('Logout failed:', response.status);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-gray-800 text-white p-4 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-4">Admin</h1>
          <ul>
            <li><a href="/admin" className="block py-2 px-4 hover:bg-gray-700">Dashboard</a></li>
            <li><a href="/admin/schemas" className="block py-2 px-4 hover:bg-gray-700">Schema Builder</a></li>
            <li><a href="/admin/leads" className="block py-2 px-4 hover:bg-gray-700">Inbound Leads</a></li>
            <li><a href="/admin/dynamic-content" className="block py-2 px-4 hover:bg-gray-700">Dynamic Content</a></li>
          </ul>
        </div>
        <div>
          <button
            onClick={handleLogout}
            className="w-full text-left py-2 px-4 text-red-400 hover:bg-gray-700 hover:text-red-300 rounded transition-colors"
          >
            Logout
          </button>
        </div>
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
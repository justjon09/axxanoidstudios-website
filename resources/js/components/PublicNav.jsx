// resources/js/components/PublicNav.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';

const PublicNav = () => {
  return (
    <nav className="bg-gray-800 text-white sticky top-0 backdrop-blur-lg z-50">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Axxanoid Studios
        </Link>
        <div className="flex space-x-4">
          <Link to="/work" className="hover:text-gray-300">
            Work
          </Link>
          <Link to="/services" className="hover:text-gray-300">
            Services
          </Link>
          <Link to="/products" className="hover:text-gray-300">
            Products
          </Link>
          <Link to="/contact" className="hover:text-gray-300">
            Contact
          </Link>
          <Link to="/admin" className="hover:text-gray-300">
            Admin
          </Link>
        </div>
        <Link to="/contact" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Get a Quote
        </Link>
      </div>
    </nav>
  );
};

export default PublicNav;
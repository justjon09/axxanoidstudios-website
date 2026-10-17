// resources/js/components/PublicFooter.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const PublicFooter = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
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
        </div>
        <div className="text-sm">
          © 2023 Axxanoid Studios. Zero-bloat engineering. 100% database-backed.
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal } from 'lucide-react';

const PublicFooter = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
          <Terminal className="w-4 h-4 text-sky-400" />
          <span>© {new Date().getFullYear()} AXXANOID STUDIOS LLC // ZERO-BLOAT ENGINEERING</span>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <Link to="/work" className="hover:text-sky-400 transition">
            Work
          </Link>
          <Link to="/services" className="hover:text-sky-400 transition">
            Services
          </Link>
          <Link to="/products" className="hover:text-sky-400 transition">
            Products
          </Link>
          <Link to="/contact" className="hover:text-sky-400 transition">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
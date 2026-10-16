import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Terminal, Shield, Cpu, Briefcase, Mail } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navLinks = [
    { name: 'Work', path: '/work', icon: Briefcase },
    { name: 'Services', path: '/services', icon: Cpu },
    { name: 'Products', path: '/products', icon: Terminal },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-mono text-lg font-bold tracking-tight text-white hover:text-sky-400 transition">
          <Terminal className="w-5 h-5 text-sky-400" />
          <span>AXXANOID_STUDIOS</span>
        </Link>
        <nav className="flex items-center gap-6">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 text-sm font-medium transition ${
                  isActive ? 'text-sky-400' : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}
          <Link
            to="/admin"
            className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded border border-slate-700 bg-slate-900 text-slate-300 hover:border-sky-500 hover:text-sky-400 transition"
          >
            <Shield className="w-3.5 h-3.5 text-sky-400" />
            <span>SYS_ADMIN</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
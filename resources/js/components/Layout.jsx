import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12">
        <Outlet />
      </main>
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500 font-mono">
        AXXANOID STUDIOS LLC // B2B ENGINEERING & INFRASTRUCTURE
      </footer>
    </div>
  );
}
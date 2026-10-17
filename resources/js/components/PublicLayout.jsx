import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNav from './PublicNav';
import PublicFooter from './PublicFooter';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <PublicNav />
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
import React, { useContext } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Layers, FileText, Users, LogOut, ExternalLink } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const navItems = [
    { name: 'Dashboard', path: '/admin', exact: true, icon: Shield },
    { name: 'Schema Builder', path: '/admin/schemas', exact: false, icon: Layers },
    { name: 'Dynamic Content', path: '/admin/dynamic-content', exact: false, icon: FileText },
    { name: 'Inbound Leads', path: '/admin/leads', exact: false, icon: Users },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <aside className="w-64 border-r border-slate-800 bg-slate-900/60 flex flex-col justify-between shrink-0">
        <div>
          <div className="h-16 px-6 border-b border-slate-800 flex items-center gap-2 font-mono text-sm font-bold tracking-wider text-white">
            <Shield className="w-4 h-4 text-sky-400" />
            <span>AXXANOID // ADMIN</span>
          </div>
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition ${
                    isActive
                      ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100 border border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 space-y-2">
          {user && (
            <div className="px-3 py-1 text-xs font-mono text-slate-400 truncate">
              {user.email}
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 px-8 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="font-mono text-xs text-slate-400">
            PATH: <span className="text-sky-400">{location.pathname}</span>
          </div>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-sky-400 transition"
          >
            <span>Public Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
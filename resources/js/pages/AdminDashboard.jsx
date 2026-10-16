import React from 'react';
import { Shield, Layers, FileText, Users } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <Shield className="w-5 h-5 text-sky-400" />
            <span>AXXANOID_CORE // ADMIN CONTROL</span>
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-1">MariaDB Connection: axxanoid_local</p>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 rounded border border-slate-800 bg-slate-900/50 space-y-2">
          <Layers className="w-5 h-5 text-sky-400" />
          <h3 className="font-semibold text-white">Dynamic Schemas</h3>
          <p className="text-xs text-slate-400">Manage `cms_schemas` and attached field definitions.</p>
        </div>
        <div className="p-6 rounded border border-slate-800 bg-slate-900/50 space-y-2">
          <FileText className="w-5 h-5 text-sky-400" />
          <h3 className="font-semibold text-white">Content Entries</h3>
          <p className="text-xs text-slate-400">CRUD records across `cms_entries` with raw JSON mapping.</p>
        </div>
        <div className="p-6 rounded border border-slate-800 bg-slate-900/50 space-y-2">
          <Users className="w-5 h-5 text-sky-400" />
          <h3 className="font-semibold text-white">Inbound Leads</h3>
          <p className="text-xs text-slate-400">Review qualified proposals stored directly in `leads`.</p>
        </div>
      </div>
    </div>
  );
}
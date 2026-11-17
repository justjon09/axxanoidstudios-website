import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FileText, Plus, ArrowRight, Layers } from 'lucide-react';

const DynamicContent = () => {
  const [schemas, setSchemas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('/api/admin/schemas')
      .then((response) => setSchemas(Array.isArray(response.data) ? response.data : []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-400" />
            <span>CONTENT_COLLECTIONS // ENTRY DIRECTORY</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Select a collection schema to manage published entries, drafts, and JSON payloads.
          </p>
        </div>
        <Link
          to="/admin/schemas"
          className="flex items-center gap-1.5 px-3 py-2 rounded border border-slate-700 bg-slate-900 text-xs font-mono text-slate-300 hover:border-sky-500 hover:text-sky-400 transition"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Configure Schemas</span>
        </Link>
      </div>

      {loading ? (
        <div className="text-xs font-mono text-slate-500">Loading collections...</div>
      ) : schemas.length === 0 ? (
        <div className="p-8 rounded border border-slate-800 bg-slate-900/40 text-center space-y-3">
          <p className="text-sm text-slate-400 font-mono">No content collections exist yet.</p>
          <Link
            to="/admin/schemas"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-sky-500 text-slate-950 font-mono text-xs font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Schema</span>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemas.map((schema) => (
            <div
              key={schema.id}
              className="p-6 rounded border border-slate-800 bg-slate-900/50 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">{schema.name}</h2>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {(schema.fields?.length || 0) + 1} fields
                  </span>
                </div>
                <div className="text-xs font-mono text-sky-400">Pull Name: {schema.slug}</div>
                {schema.description && (
                  <p className="text-xs text-slate-400 leading-relaxed">{schema.description}</p>
                )}
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-800/80">
                <Link
                  to={`/admin/entries/${schema.slug}`}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono transition"
                >
                  <span>View Entries</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to={`/admin/entries/${schema.slug}/new`}
                  className="flex items-center justify-center gap-1 px-3 py-2 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs font-mono transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DynamicContent;
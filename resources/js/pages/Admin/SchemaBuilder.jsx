import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Layers, Plus, Trash2, ArrowRight, CheckCircle2, AlertCircle, Lock } from 'lucide-react';

const FIELD_TYPES = [
  { value: 'text', label: 'Text (Single Line)' },
  { value: 'textarea', label: 'Textarea (Multi-Line)' },
  { value: 'wysiwyg', label: 'WYSIWYG / Rich HTML' },
  { value: 'number', label: 'Number / Currency' },
  { value: 'toggle', label: 'Toggle (Boolean Switch)' },
  { value: 'media', label: 'Media Asset (DAM Picker)' },
  { value: 'json', label: 'JSON / Repeater Array' },
];

const toSnakeCase = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

const toSlugCase = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const SchemaBuilder = () => {
  const [schemas, setSchemas] = useState([]);
  const [selectedSchemaId, setSelectedSchemaId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const [newSchema, setNewSchema] = useState({
    name: '',
    slug: '',
    description: '',
    icon: 'FileText',
    is_public: true,
  });
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const [newField, setNewField] = useState({
    label: '',
    handle: '',
    field_type: 'text',
    validation_rules: '',
    sort_order: 1,
  });
  const [handleManuallyEdited, setHandleManuallyEdited] = useState(false);

  const selectedSchema = schemas.find((s) => s.id === selectedSchemaId) || null;

  useEffect(() => {
    fetchSchemas();
  }, []);

  const fetchSchemas = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/schemas');
      const data = Array.isArray(response.data) ? response.data : [];
      setSchemas(data);
      if (data.length > 0 && !selectedSchemaId) {
        setSelectedSchemaId(data[0].id);
        setNewField((prev) => ({
          ...prev,
          sort_order: (data[0].fields?.length || 0) + 1,
        }));
      }
      setError('');
    } catch (err) {
      setError('Failed to load schemas from MariaDB.');
    } finally {
      setLoading(false);
    }
  };

  const flashStatus = (msg) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(''), 3500);
  };

  const handleSchemaNameChange = (e) => {
    const name = e.target.value;
    setNewSchema((prev) => ({
      ...prev,
      name,
      slug: slugManuallyEdited ? prev.slug : toSlugCase(name),
    }));
  };

  const handleCreateSchema = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('/api/admin/schemas', newSchema);
      const created = { ...response.data, fields: response.data.fields || [] };
      setSchemas((prev) => [...prev, created]);
      setSelectedSchemaId(created.id);
      setNewSchema({ name: '', slug: '', description: '', icon: 'FileText', is_public: true });
      setSlugManuallyEdited(false);
      setNewField({ label: '', handle: '', field_type: 'text', validation_rules: '', sort_order: 1 });
      flashStatus(`Schema "${created.name}" created.`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Error creating schema. Verify name and unique slug.';
      setError(msg);
    }
  };

  const handleDeleteSchema = async (schema) => {
    if (!window.confirm(`Delete schema "${schema.name}" and all attached fields/entries?`)) return;
    setError('');
    try {
      await axios.delete(`/api/admin/schemas/${schema.id}`);
      const remaining = schemas.filter((s) => s.id !== schema.id);
      setSchemas(remaining);
      if (selectedSchemaId === schema.id) {
        setSelectedSchemaId(remaining[0]?.id || null);
      }
      flashStatus(`Schema "${schema.name}" deleted.`);
    } catch (err) {
      setError('Failed to delete schema.');
    }
  };

  const handleFieldLabelChange = (e) => {
    const label = e.target.value;
    setNewField((prev) => ({
      ...prev,
      label,
      handle: handleManuallyEdited ? prev.handle : toSnakeCase(label),
    }));
  };

  const handleAddField = async (e) => {
    e.preventDefault();
    if (!selectedSchema) return;
    setError('');
    try {
      const response = await axios.post(`/api/admin/schemas/${selectedSchema.id}/fields`, {
        ...newField,
        sort_order: Number(newField.sort_order) || 0,
      });
      const createdField = response.data;
      const updatedFields = [...(selectedSchema.fields || []), createdField].sort(
        (a, b) => a.sort_order - b.sort_order
      );

      setSchemas((prev) =>
        prev.map((s) => (s.id === selectedSchema.id ? { ...s, fields: updatedFields } : s))
      );

      setNewField({
        label: '',
        handle: '',
        field_type: 'text',
        validation_rules: '',
        sort_order: updatedFields.length + 1,
      });
      setHandleManuallyEdited(false);
      flashStatus(`Field "${createdField.label}" (Pull Name: ${createdField.handle}) attached.`);
    } catch (err) {
      const validationErrors = err.response?.data;
      const detail =
        typeof validationErrors === 'object'
          ? Object.values(validationErrors).flat().join(' ')
          : 'Failed to attach field blueprint.';
      setError(detail);
    }
  };

  const handleDeleteField = async (field) => {
    if (!selectedSchema) return;
    setError('');
    try {
      await axios.delete(`/api/admin/schemas/${selectedSchema.id}/fields/${field.id}`);
      const updatedFields = (selectedSchema.fields || []).filter((f) => f.id !== field.id);
      setSchemas((prev) =>
        prev.map((s) => (s.id === selectedSchema.id ? { ...s, fields: updatedFields } : s))
      );
      flashStatus(`Field "${field.handle}" removed.`);
    } catch (err) {
      setError('Failed to remove field.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-400" />
            <span>SCHEMA_BUILDER // BLUEPRINT ENGINE</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Define collections in `cms_schemas` and bind explicit Pull Name blueprints in `cms_fields`.
          </p>
        </div>
        {statusMessage && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <CheckCircle2 className="w-4 h-4" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-mono">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Create Schema + Schema List */}
        <div className="lg:col-span-5 space-y-6">
          <form
            onSubmit={handleCreateSchema}
            className="p-6 rounded border border-slate-800 bg-slate-900/50 space-y-4"
          >
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-sky-400">
              1. Register Collection Schema
            </h2>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Collection Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., White Papers"
                value={newSchema.name}
                onChange={handleSchemaNameChange}
                className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-sm text-white focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-mono text-slate-300">Schema Slug / Route Key *</label>
                <span className="text-xs font-mono text-sky-400">
                  Pull Name: {newSchema.slug || 'auto'}
                </span>
              </div>
              <input
                type="text"
                required
                placeholder="e.g., white-papers"
                value={newSchema.slug}
                onChange={(e) => {
                  setSlugManuallyEdited(true);
                  setNewSchema({ ...newSchema, slug: toSlugCase(e.target.value) });
                }}
                className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-sm font-mono text-sky-300 focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Description</label>
              <input
                type="text"
                placeholder="Deep-dive architecture case studies and white papers"
                value={newSchema.description}
                onChange={(e) => setNewSchema({ ...newSchema, description: e.target.value })}
                className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-sm text-white focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newSchema.is_public}
                  onChange={(e) => setNewSchema({ ...newSchema, is_public: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-950 text-sky-500"
                />
                <span>Public API Accessible (`is_public`)</span>
              </label>

              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs font-mono transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Schema</span>
              </button>
            </div>
          </form>

          {/* Existing Schemas List */}
          <div className="p-6 rounded border border-slate-800 bg-slate-900/50 space-y-3">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-300">
              Active Schemas ({schemas.length})
            </h2>

            {loading ? (
              <p className="text-xs font-mono text-slate-500">Loading schemas...</p>
            ) : schemas.length === 0 ? (
              <p className="text-xs font-mono text-slate-500">
                No schemas defined yet. Create one above.
              </p>
            ) : (
              <div className="space-y-2">
                {schemas.map((schema) => {
                  const isSelected = schema.id === selectedSchemaId;
                  return (
                    <div
                      key={schema.id}
                      onClick={() => {
                        setSelectedSchemaId(schema.id);
                        setNewField((prev) => ({
                          ...prev,
                          sort_order: (schema.fields?.length || 0) + 1,
                        }));
                      }}
                      className={`p-3.5 rounded border transition cursor-pointer ${
                        isSelected
                          ? 'border-sky-500/50 bg-sky-500/10'
                          : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-white text-sm">{schema.name}</div>
                          <div className="text-xs font-mono text-sky-400 mt-0.5">
                            Pull Name: {schema.slug}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {(schema.fields?.length || 0) + 1} fields
                          </span>
                          <Link
                            to={`/admin/entries/${schema.slug}`}
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded bg-slate-800 hover:bg-sky-500 hover:text-slate-950 text-slate-300 transition"
                            title="Manage Entries"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSchema(schema);
                            }}
                            className="p-1.5 rounded bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition cursor-pointer"
                            title="Delete Schema"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      {schema.description && (
                        <p className="text-xs text-slate-400 mt-2">{schema.description}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Field Blueprint Manager for Selected Schema */}
        <div className="lg:col-span-7 space-y-6">
          {selectedSchema ? (
            <>
              <div className="p-6 rounded border border-slate-800 bg-slate-900/50 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>{selectedSchema.name} // Field Blueprints</span>
                    </h2>
                    <span className="text-xs font-mono text-sky-400">
                      Endpoint: /api/content/{selectedSchema.slug}
                    </span>
                  </div>
                  <Link
                    to={`/admin/entries/${selectedSchema.slug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-sky-500/40 bg-sky-500/10 text-sky-400 hover:bg-sky-500 hover:text-slate-950 text-xs font-mono font-semibold transition"
                  >
                    <span>Manage Entries</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Field List */}
                <div className="space-y-2">
                  {/* Universal Blueprint Base Field: main_body */}
                  <div className="flex items-center justify-between p-3 rounded border border-slate-800/80 bg-slate-950/90">
                    <div className="flex items-center gap-3">
                      <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-white">
                          Main Body Content{' '}
                          <span className="text-xs font-mono text-slate-400">(Universal Base)</span>
                        </div>
                        <div className="text-xs font-mono text-emerald-400">
                          Pull Name: main_body
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      wysiwyg / narrative
                    </span>
                  </div>

                  {/* Custom Dynamic Fields */}
                  {(selectedSchema.fields || []).map((field) => (
                    <div
                      key={field.id}
                      className="flex items-center justify-between p-3 rounded border border-slate-800 bg-slate-950/60"
                    >
                      <div>
                        <div className="text-sm font-medium text-white flex items-center gap-2">
                          <span>{field.label}</span>
                          <span className="text-xs font-mono text-slate-500">
                            #{field.sort_order}
                          </span>
                        </div>
                        <div className="text-xs font-mono text-emerald-400 mt-0.5">
                          Pull Name: {field.handle}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {field.validation_rules && (
                          <span className="text-xs font-mono text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            {field.validation_rules}
                          </span>
                        )}
                        <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-sky-400">
                          {field.field_type}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteField(field)}
                          className="p-1.5 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition cursor-pointer"
                          title="Delete Field"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Field Blueprint Form */}
              <form
                onSubmit={handleAddField}
                className="p-6 rounded border border-slate-800 bg-slate-900/50 space-y-4"
              >
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-sky-400">
                  2. Append Dynamic Field to {selectedSchema.name}
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Field Label *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Client Hourly Rate"
                      value={newField.label}
                      onChange={handleFieldLabelChange}
                      className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-sm text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-mono text-slate-300">
                        Programmatic Pull Name (`handle`) *
                      </label>
                      <span className="text-xs font-mono text-emerald-400">
                        entry.data.{newField.handle || '...'}
                      </span>
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="e.g., client_hourly_rate"
                      value={newField.handle}
                      onChange={(e) => {
                        setHandleManuallyEdited(true);
                        setNewField({ ...newField, handle: toSnakeCase(e.target.value) });
                      }}
                      className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-sm font-mono text-emerald-400 focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Field Type *
                    </label>
                    <select
                      value={newField.field_type}
                      onChange={(e) => setNewField({ ...newField, field_type: e.target.value })}
                      className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-sm text-white focus:border-sky-500 focus:outline-none"
                    >
                      {FIELD_TYPES.map((ft) => (
                        <option key={ft.value} value={ft.value}>
                          {ft.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Validation Rules (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., required|string|max:255"
                      value={newField.validation_rules}
                      onChange={(e) =>
                        setNewField({ ...newField, validation_rules: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      value={newField.sort_order}
                      onChange={(e) =>
                        setNewField({ ...newField, sort_order: parseInt(e.target.value, 10) || 0 })
                      }
                      className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs font-mono transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Attach Field Blueprint</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="p-12 rounded border border-slate-800 bg-slate-900/30 text-center font-mono text-sm text-slate-500">
              Select or create a schema on the left to configure its field blueprints.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchemaBuilder;
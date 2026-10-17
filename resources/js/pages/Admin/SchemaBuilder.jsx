import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SchemaBuilder = () => {
  const [schemas, setSchemas] = useState([]);
  const [newSchema, setNewSchema] = useState({ name: '', slug: '', description: '', icon: '', is_public: false });
  const [selectedSchema, setSelectedSchema] = useState(null);
  const [newField, setNewField] = useState({ label: '', handle: '', field_type: '', validation_rules: '', sort_order: 0 });

  useEffect(() => {
    axios.get('/api/admin/schemas')
      .then(response => setSchemas(response.data));
  }, []);

  const handleCreateSchema = () => {
    axios.post('/api/admin/schemas', newSchema)
      .then(response => {
        setSchemas([...schemas, response.data]);
        setNewSchema({ name: '', slug: '', description: '', icon: '', is_public: false });
      });
  };

  const handleAddField = () => {
    axios.post(`/api/admin/schemas/${selectedSchema.id}/fields`, newField)
      .then(response => {
        setSelectedSchema({ ...selectedSchema, fields: [...selectedSchema.fields, response.data] });
        setNewField({ label: '', handle: '', field_type: '', validation_rules: '', sort_order: 0 });
      });
  };

  return (
    <div>
      <h1>Schema Builder</h1>
      <div>
        <h2>Create New Schema</h2>
        <input type="text" placeholder="Name" value={newSchema.name} onChange={e => setNewSchema({ ...newSchema, name: e.target.value })} />
        <input type="text" placeholder="Slug" value={newSchema.slug} onChange={e => setNewSchema({ ...newSchema, slug: e.target.value })} />
        <input type="text" placeholder="Description" value={newSchema.description} onChange={e => setNewSchema({ ...newSchema, description: e.target.value })} />
        <input type="text" placeholder="Icon" value={newSchema.icon} onChange={e => setNewSchema({ ...newSchema, icon: e.target.value })} />
        <label>
          <input type="checkbox" checked={newSchema.is_public} onChange={e => setNewSchema({ ...newSchema, is_public: e.target.checked })} />
          Public
        </label>
        <button onClick={handleCreateSchema}>Create Schema</button>
      </div>
      <div>
        <h2>Schemas</h2>
        <ul>
          {schemas.map(schema => (
            <li key={schema.id} onClick={() => setSelectedSchema(schema)}>
              {schema.name}
            </li>
          ))}
        </ul>
      </div>
      {selectedSchema && (
        <div>
          <h2>Fields for {selectedSchema.name}</h2>
          <ul>
            {selectedSchema.fields.map(field => (
              <li key={field.id}>{field.label}</li>
            ))}
          </ul>
          <div>
            <h3>Add New Field</h3>
            <input type="text" placeholder="Label" value={newField.label} onChange={e => setNewField({ ...newField, label: e.target.value })} />
            <input type="text" placeholder="Validation Rules" value={newField.validation_rules} onChange={e => setNewField({ ...newField, validation_rules: e.target.value })} />
            <input type="number" placeholder="Sort Order" value={newField.sort_order} onChange={e => setNewField({ ...newField, sort_order: parseInt(e.target.value) })} />
            <button onClick={handleAddField}>Add Field</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchemaBuilder;
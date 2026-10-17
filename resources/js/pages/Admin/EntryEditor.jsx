import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EntryEditor = () => {
  const { schemaSlug, id } = useParams();
  const navigate = useNavigate();
  const [schema, setSchema] = useState(null);
  const [entry, setEntry] = useState({ title: '', slug: '', data: {} });

  useEffect(() => {
    axios.get(`/api/admin/schemas`)
      .then(response => {
        const schemaData = response.data.find(s => s.slug === schemaSlug);
        setSchema(schemaData);
      });

    if (id) {
      axios.get(`/api/admin/entries/${id}`)
        .then(response => setEntry(response.data));
    }
  }, [schemaSlug, id]);

  const handleChange = (e) => {
    setEntry({ ...entry, data: { ...entry.data, [e.target.name]: e.target.value } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      axios.put(`/api/admin/entries/${id}`, entry)
        .then(() => navigate(`/admin/entries/${schemaSlug}`));
    } else {
      axios.post(`/api/admin/entries/${schemaSlug}`, entry)
        .then(() => navigate(`/admin/entries/${schemaSlug}`));
    }
  };

  return (
    <div>
      <h1>{id ? 'Edit Entry' : 'New Entry'}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input type="text" name="title" value={entry.title} onChange={handleChange} required />
        </div>
        <div>
          <label>Slug</label>
          <input type="text" name="slug" value={entry.slug} onChange={handleChange} required />
        </div>
        {schema && schema.fields.map(field => (
          <div key={field.id}>
            <label>{field.label}</label>
            <input type="text" name={field.handle} value={entry.data[field.handle] || ''} onChange={handleChange} />
          </div>
        ))}
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EntryEditor;
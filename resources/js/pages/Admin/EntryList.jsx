import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const EntryList = ({ schemaSlug }) => {
  const [entries, setEntries] = useState([]);
  const [schema, setSchema] = useState(null);

  useEffect(() => {
    axios.get(`/api/admin/schemas`)
      .then(response => {
        const schemaData = response.data.find(s => s.slug === schemaSlug);
        setSchema(schemaData);
      });

    axios.get(`/api/admin/entries/${schemaSlug}`)
      .then(response => setEntries(response.data));
  }, [schemaSlug]);

  return (
    <div>
      <h1>Entries for {schema ? schema.name : 'Loading...'}</h1>
      <table className="table-auto">
        <thead>
          <tr>
            <th>Title</th>
            <th>Slug</th>
            <th>Published</th>
            <th>Updated At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(entry => (
            <tr key={entry.id}>
              <td>{entry.title}</td>
              <td>{entry.slug}</td>
              <td>{entry.is_published ? 'Yes' : 'No'}</td>
              <td>{entry.updated_at}</td>
              <td>
                <Link to={`/admin/entries/${schemaSlug}/${entry.id}`}>Edit</Link> |
                <button onClick={() => axios.delete(`/api/admin/entries/${entry.id}`).then(() => setEntries(entries.filter(e => e.id !== entry.id)))}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to={`/admin/entries/${schemaSlug}/new`}>New Entry</Link>
    </div>
  );
};

export default EntryList;
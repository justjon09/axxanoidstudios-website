import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DynamicContent = () => {
  const [schemas, setSchemas] = useState([]);

  useEffect(() => {
    axios.get('/api/admin/schemas')
      .then(response => setSchemas(response.data));
  }, []);

  return (
    <div>
      <h1>Dynamic Content</h1>
      <ul>
        {schemas.map(schema => (
          <li key={schema.id}>
            <Link to={`/admin/entries/${schema.slug}`}>{schema.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DynamicContent;
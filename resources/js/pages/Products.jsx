import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/content/digital-products?published=1')
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching products');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-white">Software Utilities & Plugins</h1>
        <p className="text-slate-400">Direct digital delivery for standalone scripts, utilities, and WordPress showcase plugins.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <div className="flex items-center space-x-2">
                <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">Version {product.version}</span>
                <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">${product.price}</span>
              </div>
              {product.demo_url && (
                <div className="mt-2">
                  <a href={product.demo_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    Demo
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
  );
}
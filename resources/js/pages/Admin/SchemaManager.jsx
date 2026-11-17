import React, { useEffect, useState } from 'react';
import { useFetch } from 'react-fetch-hook';
import { LucideLoader } from 'lucide-react';

const SchemaManager = () => {
    const [schemas, setSchemas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/admin/schemas', {
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            setSchemas(data);
            setLoading(false);
        })
        .catch(error => {
            setError(error.message);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className='p-6 text-white bg-gray-900 min-h-screen'>
                <h1 className='text-2xl font-bold mb-6'>Schema Manager</h1>
                <div>Loading schemas...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='p-6 text-white bg-gray-900 min-h-screen'>
                <h1 className='text-2xl font-bold mb-6'>Schema Manager</h1>
                <div className='text-red-500'>{error}</div>
            </div>
        );
    }

    return (
        <div className='p-6 text-white bg-gray-900 min-h-screen'>
            <h1 className='text-2xl font-bold mb-6'>Schema Manager</h1>
            {schemas.map(schema => (
                <div key={schema.id} className='bg-gray-800 p-4 rounded-lg mb-4 border border-gray-700'>
                    <h2 className='text-xl font-semibold'>{schema.name}</h2>
                    <span className='text-xs text-blue-400 font-mono'>Pull Name: {schema.slug}</span>
                    <p className='text-gray-400 mt-2'>{schema.description}</p>
                    {schema.fields && schema.fields.length > 0 && (
                        schema.fields.map(field => (
                            <div key={field.id} className='flex justify-between border-t border-gray-700 pt-2 mt-2'>
                                <span className='text-gray-400'>{field.label} ({field.field_type})</span>
                                <span className='text-xs text-green-400 font-mono'>Pull Name: {field.handle}</span>
                            </div>
                        ))
                    )}
                </div>
            ))}
        </div>
    );
};

export default SchemaManager;
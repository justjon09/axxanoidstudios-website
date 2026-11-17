import React from 'react';

const DynamicFormBuilder = ({ schema, formData, onChange }) => {
    return (
        <div className='space-y-6'>
            <div className='flex flex-col mb-4'>
                <label>Main Body Content</label>
                <span className='text-xs text-green-400 font-mono ml-2'>Pull Name: main_body</span>
                <textarea
                    className='w-full bg-gray-800 text-white border border-gray-700 rounded p-2 mt-1 min-h-[150px]'
                    value={formData.main_body || ''}
                    onChange={(e) => onChange('main_body', e.target.value)}
                ></textarea>
            </div>
            {schema.fields && schema.fields.length > 0 && (
                schema.fields.map(field => (
                    <div key={field.id} className='flex flex-col mb-4'>
                        <label>{field.label}</label>
                        <span className='text-xs text-green-400 font-mono ml-2'>Pull Name: {field.handle}</span>
                        {field.field_type === 'text' && (
                            <input
                                type='text'
                                className='w-full bg-gray-800 text-white border border-gray-700 rounded p-2 mt-1'
                                value={formData[field.handle] || ''}
                                onChange={(e) => onChange(field.handle, e.target.value)}
                            />
                        )}
                        {field.field_type === 'textarea' && (
                            <textarea
                                className='w-full bg-gray-800 text-white border border-gray-700 rounded p-2 mt-1 min-h-[150px]'
                                value={formData[field.handle] || ''}
                                onChange={(e) => onChange(field.handle, e.target.value)}
                            ></textarea>
                        )}
                        {field.field_type === 'number' && (
                            <input
                                type='number'
                                className='w-full bg-gray-800 text-white border border-gray-700 rounded p-2 mt-1'
                                value={formData[field.handle] || ''}
                                onChange={(e) => onChange(field.handle, e.target.value)}
                            />
                        )}
                        {(field.field_type === 'boolean' || field.field_type === 'toggle') && (
                            <input
                                type='checkbox'
                                className='mt-1'
                                checked={formData[field.handle] || false}
                                onChange={(e) => onChange(field.handle, e.target.checked)}
                            />
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default DynamicFormBuilder;
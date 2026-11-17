import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const MediaManagerModal = ({ isOpen, onClose, onSelect }) => {
  const [mediaList, setMediaList] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/admin/media')
        .then(response => response.json())
        .then(data => setMediaList(data));
    }
  }, [isOpen]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      setIsUploading(true);
      fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      })
      .then(response => response.json())
      .then(newMedia => {
        setMediaList([newMedia, ...mediaList]);
        setIsUploading(false);
      })
      .catch(error => {
        console.error('Error uploading file:', error);
        setIsUploading(false);
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-700 text-white max-w-3xl p-6 rounded">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Media Library</h2>
          <button onClick={onClose} className="p-2">
            <X size={24} />
          </button>
        </div>
        <div className="mb-4">
          <input
            type="file"
            onChange={handleFileChange}
            disabled={isUploading}
            className="bg-gray-800 text-white p-2 rounded cursor-pointer"
          />
          {isUploading && <p className="text-sm text-gray-400">Uploading...</p>}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mediaList.map(item => (
            <div key={item.id} onClick={() => { onSelect(item); onClose(); }} className="cursor-pointer">
              <img
                src={item.responsive_variants?.thumb || item.file_path}
                alt={item.title}
                className="w-full h-32 object-cover rounded"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MediaManagerModal;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PublicLayout from '../components/PublicLayout';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service_category: 'hours',
    requirements: '',
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!formData.name) {
      validationErrors.name = 'Name is required';
    }
    if (!formData.email) {
      validationErrors.email = 'Email is required';
    } else if (!/^[\w-\.]+@[\w-\.]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      validationErrors.email = 'Invalid email format';
    }
    if (!formData.requirements) {
      validationErrors.requirements = 'Requirements are required';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    axios.post('/api/leads', formData)
      .then(response => {
        setSuccessMessage('Proposal received. An engineer will review your specifications within 24 hours.');
        setFormData({
          name: '',
          email: '',
          company: '',
          service_category: 'hours',
          requirements: '',
        });
        setErrors({});
        setTimeout(() => {
          setSuccessMessage('');
          navigate('/');
        }, 3000);
      })
      .catch(error => {
        console.error('Error submitting form:', error);
      });
  };

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-3xl font-bold tracking-tight text-white">Engineering Intake</h1>
      <p className="text-slate-400">Submit parameters for advisory, architectural review, or full builds.</p>
      {successMessage && (
        <div className="bg-green-500 text-white p-4 rounded mb-4">
          {successMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-slate-800 bg-slate-900 text-white rounded"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-slate-800 bg-slate-900 text-white rounded"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-white">Company</label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-slate-800 bg-slate-900 text-white rounded"
          />
        </div>
        <div>
          <label htmlFor="service_category" className="block text-sm font-medium text-white">Service Category</label>
          <select
            id="service_category"
            name="service_category"
            value={formData.service_category}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-slate-800 bg-slate-900 text-white rounded"
          >
            <option value="hours">Hours</option>
            <option value="task">Task</option>
            <option value="project">Project</option>
          </select>
        </div>
        <div>
          <label htmlFor="requirements" className="block text-sm font-medium text-white">Requirements</label>
          <textarea
            id="requirements"
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full p-2 border border-slate-800 bg-slate-900 text-white rounded"
          ></textarea>
          {errors.requirements && <p className="text-red-500 text-sm mt-1">{errors.requirements}</p>}
        </div>
        <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600">
          Submit
        </button>
      </form>
    </div>
  );
}
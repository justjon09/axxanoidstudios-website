import React from 'react';
import { Link } from 'react-router-dom';

export default function Services() {
  return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-white">Engineering Services</h1>
        <p className="text-slate-400">High-ticket engineering engagements: Retainers, discrete task sprints, and custom architecture builds.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-2">Custom Web Tooling & Portals</h3>
            <p className="text-gray-600 mb-4">Build custom web tools and portals tailored to your specific needs.</p>
            <Link to="/contact?category=web_tooling" className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600">
              Get a Quote
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-2">API Design & High-Volume Integrations</h3>
            <p className="text-gray-600 mb-4">Design and implement high-volume API integrations for seamless data exchange.</p>
            <Link to="/contact?category=api_design" className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600">
              Get a Quote
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-2">Database Schemas & Legacy Data Migrations</h3>
            <p className="text-gray-600 mb-4">Design and manage database schemas, and handle legacy data migrations efficiently.</p>
            <Link to="/contact?category=database_schemas" className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600">
              Get a Quote
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-2">Containerized Systems & Performance Auditing</h3>
            <p className="text-gray-600 mb-4">Deploy containerized systems and perform comprehensive performance auditing.</p>
            <Link to="/contact?category=containerized_systems" className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600">
              Get a Quote
            </Link>
          </div>
        </div>
      </div>
  );
}
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Database, Server, Terminal } from 'lucide-react';

export default function Home() {
  const [caseStudies, setCaseStudies] = useState([]);

  useEffect(() => {
    axios.get('/api/content/white-papers?published=1')
      .then(response => {
        setCaseStudies(response.data);
      })
      .catch(error => {
        console.error('Error fetching case studies:', error);
      });
  }, []);

  return (
    <div className="space-y-16">
      <section className="space-y-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 font-mono text-xs">
          <span>ROOT_INFRASTRUCTURE: PHP 8.3 + REACT 19 + MARIADB</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Senior Full-Stack Engineering & Scaled Integrations.
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed">
          Parent engineering umbrella and custom application showcase. We engineer high-reliability web tools, custom runtime APIs, and zero-bloat database infrastructure.
        </p>
        <div className="flex gap-4 pt-4">
          <Link to="/contact" className="px-6 py-3 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold transition flex items-center gap-2">
            <span>Initiate Proposal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/work" className="px-6 py-3 rounded border border-slate-800 bg-slate-900 hover:border-slate-700 text-slate-200 font-medium transition">
            Explore Architecture
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6 pt-8 border-t border-slate-900">
        <div className="p-6 rounded-lg border border-slate-800/80 bg-slate-900/40 space-y-3">
          <Server className="w-6 h-6 text-sky-400" />
          <h3 className="font-semibold text-white">Full-Stack Core</h3>
          <p className="text-sm text-slate-400">Laravel 11 routing engine paired directly with React 19 over pure MariaDB SQL. Zero flat-file overhead.</p>
        </div>
        <div className="p-6 rounded-lg border border-slate-800/80 bg-slate-900/40 space-y-3">
          <Database className="w-6 h-6 text-sky-400" />
          <h3 className="font-semibold text-white">Direct DB Architecture</h3>
          <p className="text-sm text-slate-400">Pure schema modeling and relationship indexing. Zero framework migrations.</p>
        </div>
        <div className="p-6 rounded-lg border border-slate-800/80 bg-slate-900/40 space-y-3">
          <Terminal className="w-6 h-6 text-sky-400" />
          <h3 className="font-semibold text-white">Custom Tooling</h3>
          <p className="text-sm text-slate-400">Containerized sandboxes, custom scrapers, and headless transactional engines.</p>
        </div>
      </section>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-4">Featured White Papers / Case Studies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {caseStudies.map(caseStudy => (
            <div key={caseStudy.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-2">{caseStudy.title}</h3>
              <p className="text-gray-600 mb-4">{caseStudy.summary}</p>
              <Link to={`/work/${caseStudy.slug}`} className="text-blue-500 hover:underline">
                Read More
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Conversion Callout</h2>
        <p className="text-lg mb-4">
          Ready to take the next step? Contact us today!
        </p>
        <Link to="/contact" className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600">
          Get a Quote
        </Link>
      </div>
    </div>
  );
}
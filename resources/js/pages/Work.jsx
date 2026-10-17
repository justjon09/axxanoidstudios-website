import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Work() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/content/white-papers?published=1')
      .then(response => {
        setCaseStudies(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching case studies');
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
        <h1 className="text-3xl font-bold tracking-tight text-white">Case Studies & White Papers</h1>
        <p className="text-slate-400">Technical breakdowns and architectural post-mortems of scaled systems.</p>
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
  );
}
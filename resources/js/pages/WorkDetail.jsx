import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PublicLayout from '../components/PublicLayout';

export default function WorkDetail() {
  const { slug } = useParams();
  const [caseStudy, setCaseStudy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`/api/content/white-papers/${slug}`)
      .then(response => {
        setCaseStudy(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching case study');
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!caseStudy) {
    return <div>404 // CASE_STUDY_NOT_FOUND</div>;
  }

  return (
    <div className="space-y-16">
      <h1 className="text-3xl font-bold tracking-tight text-white">{caseStudy.title}</h1>
      <p className="text-slate-400">{caseStudy.summary}</p>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Architecture & Problem Statement</h2>
        <p>{caseStudy.data.architecture_problem_statement}</p>
        <h2 className="text-2xl font-bold">Implementation Details & Challenges Overcome</h2>
        <p>{caseStudy.data.implementation_details}</p>
        <h2 className="text-2xl font-bold">Technical Specifications / Tech Stack Badges</h2>
        <p>{caseStudy.data.tech_stack_badges}</p>
        <h2 className="text-2xl font-bold">Dynamic Fields</h2>
        <p>{caseStudy.data.custom_metrics}</p>
        <p>{caseStudy.data.diagram_urls}</p>
      </div>
    </div>
  );
}
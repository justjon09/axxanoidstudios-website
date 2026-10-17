import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LeadList = () => {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    axios.get('/api/admin/leads')
      .then(response => setLeads(response.data));
  }, []);

  return (
    <div>
      <h1>Inbound Leads</h1>
      <table className="table-auto">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Company</th>
            <th>Service Category</th>
            <th>Quote Estimate</th>
            <th>Created Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {leads.map(lead => (
            <tr key={lead.id}>
              <td>{lead.name}</td>
              <td>{lead.email}</td>
              <td>{lead.company}</td>
              <td>{lead.service_category}</td>
              <td>{lead.quote_estimate}</td>
              <td>{lead.created_at}</td>
              <td>{lead.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadList;
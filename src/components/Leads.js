import React, { useEffect, useState } from 'react';
import { fetchWrapper } from '../utils/fetchWrapper';

function Leads() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form state for new lead submission
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    interest: '',
  });

  // Load all projects for the dropdown
  const loadProjects = async () => {
    try {
      const res = await fetchWrapper.get('/projects');
      setProjects(res.data || []);
      if (res.data.length > 0) setSelectedProject(res.data[0].domain);
    } catch (err) {
      console.error('Failed to load projects', err);
    }
  };

  // Load leads for selected project
  const loadLeads = async (domain) => {
    if (!domain) return;
    setLoading(true);
    try {
      const res = await fetchWrapper.get(`/leads?projectDomain=${domain}`);
      setLeads(res.data || []);
    } catch (err) {
      console.error('Failed to fetch leads', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) loadLeads(selectedProject);
  }, [selectedProject]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProject) return alert('Select a project');

    try {
      const payload = {
        projectDomain: selectedProject,
        ...formData,
      };
      await fetchWrapper.post('/leads', payload);
      alert('Lead submitted successfully');
      setFormData({ name: '', mobile: '', interest: '' });
      loadLeads(selectedProject);
    } catch (err) {
      console.error(err);
      alert('Failed to submit lead: ' + (err.message || 'Error'));
    }
  };

  return (
    <div>
      <h3>Leads</h3>

      {/* Project selector */}
      <div className="mb-3">
        <label className="form-label">Select Project:</label>
        <select
          className="form-select"
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          {projects.map((p) => (
            <option key={p.domain} value={p.domain}>{p.projectName} ({p.domain})</option>
          ))}
        </select>
      </div>

      {/* Add new lead form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row">
          <div className="col-md-4 mb-2">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Lead Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4 mb-2">
            <input
              type="text"
              name="mobile"
              className="form-control"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4 mb-2">
            <input
              type="text"
              name="interest"
              className="form-control"
              placeholder="Interest (optional)"
              value={formData.interest}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2 mb-2">
            <button type="submit" className="btn btn-primary w-100">Submit Lead</button>
          </div>
        </div>
      </form>

      {/* Leads table */}
      {loading ? (
        <p>Loading leads...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Mobile</th>
                <th>Interest</th>
                <th>Project Domain</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">No leads found</td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id}>
                    <td>{lead.name}</td>
                    <td>{lead.mobile}</td>
                    <td>{lead.interest || '-'}</td>
                    <td>{lead.projectDomain}</td>
                    <td>{new Date(lead.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Leads;
    
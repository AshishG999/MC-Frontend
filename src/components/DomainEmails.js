import React, { useEffect, useState } from 'react';
import { fetchWrapper } from '../utils/fetchWrapper';

function DomainEmails() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    domains: '',
  });

  const loadEmails = async () => {
    setLoading(true);
    try {
      const res = await fetchWrapper.get('/domain-emails');
      setEmails(res.data || []);
    } catch (err) {
      console.error('Failed to fetch domain emails', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadEmails();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        email: formData.email,
        domains: formData.domains.split(',').map(d => d.trim()).filter(Boolean),
      };
      await fetchWrapper.post('/domain-emails', payload);
      alert('Domain email saved successfully');
      setFormData({ email: '', domains: '' });
      loadEmails();
    } catch (err) {
      console.error(err);
      alert('Failed to save domain email: ' + (err.message || 'Error'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this email mapping?')) return;
    try {
      await fetchWrapper.delete(`/domain-emails/${id}`);
      alert('Deleted successfully');
      loadEmails();
    } catch (err) {
      console.error(err);
      alert('Failed to delete');
    }
  };

  return (
    <div>
      <h3>Domain Emails</h3>

      {/* Add / Update Email Form */}
      <form onSubmit={handleSave} className="mb-4">
        <div className="row">
          <div className="col-md-4 mb-2">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-2">
            <input
              type="text"
              name="domains"
              className="form-control"
              placeholder="Domains (comma separated)"
              value={formData.domains}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2 mb-2">
            <button type="submit" className="btn btn-primary w-100">Save</button>
          </div>
        </div>
      </form>

      {/* Domain Emails Table */}
      {loading ? (
        <p>Loading domain emails...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>Email</th>
                <th>Domains</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {emails.length === 0 ? (
                <tr><td colSpan="4" className="text-center">No domain emails found</td></tr>
              ) : (
                emails.map((item) => (
                  <tr key={item._id}>
                    <td>{item.email}</td>
                    <td>{item.domains.join(', ')}</td>
                    <td>{new Date(item.createdAt).toLocaleString()}</td>
                    <td>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item._id)}>Delete</button>
                    </td>
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

export default DomainEmails;

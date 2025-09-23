import React, { use, useEffect, useState } from 'react';
import { fetchWrapper } from '../utils/fetchWrapper';
import { findProperty } from '../api/project';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [urbanProjects, setUrbanProjects] = useState([])
  const [formData, setFormData] = useState({
    domain: '',
    projectName: '',
    projectId: '',
    city: '',
    status: 'inactive',
  });
  // Load projects from backend
  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await fetchWrapper.get('/projects');
      setProjects(res.data || []);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const timeRef = React.useRef();
  useEffect(() => {
    if (formData?.projectName) {
      clearTimeout(timeRef.current);
      timeRef.current = setTimeout(() => {
        let response = findProperty({ searchValue: formData?.projectName });
        setUrbanProjects(response.property || []);
      }, 300);
    }
    // Cleanup on unmount or when formData changes
    return () => clearTimeout(timeRef.current);
  }, [formData]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await fetchWrapper.post('/projects', formData);
      alert('Project saved successfully');
      setFormData({ domain: '', projectName: '', city: '', status: 'inactive' });
      loadProjects();
    } catch (err) {
      console.error(err);
      alert('Failed to save project: ' + (err.message || 'Error'));
    }
  };

  const handleDelete = async (project) => {
    if (!window.confirm(`Delete project ${project.domain}?`)) return;
    try {
      await fetchWrapper.delete(`/projects/${project._id}`);
      alert('Project deleted');
      loadProjects();
    } catch (err) {
      console.error(err);
      alert('Failed to delete project');
    }
  };

  return (
    <div>
      <h3>Projects Dashboard</h3>

      {/* Create / Add Project Form */}
      <form onSubmit={handleSave} className="mb-4">
        <div className="row">
          <div className="col-md-3 mb-2">
            <input
              type="text"
              name="domain"
              className="form-control"
              placeholder="Domain"
              value={formData.domain}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3 mb-2">
            <div className="position-relative">

              <input
                type="text"
                name="projectName"
                className="form-control"
                placeholder="Project Name"
                value={formData.projectName}
                onChange={handleChange}
                required
              />
              {urbanProjects && urbanProjects.length > 0 &&
                <div className='position-absolute'>
                  {urbanProjects.map((e, i) => <div onClick={() => {
                    setFormData({
                      ...formData,
                      projectId: e._id,
                      projectName: e.name
                    });
                    setUrbanProjects([]);
                  }}>{e.name}</div>)}
                </div>}
            </div>
          </div>
          <div className="col-md-2 mb-2">
            <input
              type="text"
              name="city"
              className="form-control"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2 mb-2">
            <select
              name="status"
              className="form-select"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-2">Add Project</button>
      </form>

      {/* Projects Table */}
      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>Domain</th>
                <th>Project Name</th>
                <th>GitHub Repo</th>
                <th>City</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr><td colSpan="7" className="text-center">No projects found</td></tr>
              ) : (
                projects.map((project) => (
                  <tr key={project._id}>
                    <td><a href={project.domain}>{project.domain}</a></td>
                    <td>{project.projectName}</td>
                    <td>{project.githubRepo || '-'}</td>
                    <td>{project.city || '-'}</td>
                    <td>{project.status}</td>
                    <td>{new Date(project.createdAt).toLocaleString()}</td>
                    <td>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(project)}>Delete</button>
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

export default Projects;

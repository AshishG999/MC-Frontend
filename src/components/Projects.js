import React, { useEffect, useState, useRef } from 'react';
import { fetchWrapper } from '../utils/fetchWrapper';
import { findProperty } from '../api/project';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [urbanProjects, setUrbanProjects] = useState([]);
  const [formData, setFormData] = useState({
    domain: '',
    projectName: '',
    projectId: '',
    city: '',
    status: 'inactive',
    templateRepo: '', // template repo URL
  });
  const [templatePreview, setTemplatePreview] = useState(null);

  const timeRef = useRef();

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

  // Search for existing projects
  useEffect(() => {
    if (!formData.projectName) {
      setUrbanProjects([]);
      return;
    }

    clearTimeout(timeRef.current);

    timeRef.current = setTimeout(async () => {
      try {
        const response = await findProperty({ searchValue: formData.projectName });
        setUrbanProjects(response.propertys || []);
      } catch (err) {
        console.error('Error fetching urban projects', err);
        setUrbanProjects([]);
      }
    }, 300);

    return () => clearTimeout(timeRef.current);
  }, [formData.projectName]);

  // Preview template site when templateRepo changes


  /**
 * Sanitize domain to use as GitHub repo name
 */
  function sanitizeRepoName(domain) {
    return domain.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  }
  // Inside Projects component...
  useEffect(() => {
    if (!formData.templateRepo && !formData.domain) {
      setTemplatePreview(null);
      return;
    }

    let previewUrl = null;

    // If the project already exists (domain provided), preview live site
    if (formData.domain) {
      previewUrl = `http://${sanitizeRepoName(formData.domain)}`;
    }
    // Otherwise, fallback to GitHub raw repo index.html
    else if (formData.templateRepo.includes('github.com')) {
      const repoUrl = formData.templateRepo
        .replace('https://github.com/', '')
        .replace('.git', '');
      previewUrl = `https://raw.githubusercontent.com/${repoUrl}/main/index.html`;
    }

    setTemplatePreview(previewUrl);
  }, [formData.templateRepo, formData.domain]);



  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await fetchWrapper.post('/projects', formData);
      alert('Project saved successfully');
      setFormData({
        domain: '',
        projectName: '',
        city: '',
        status: 'inactive',
        templateRepo: ''
      });
      setTemplatePreview(null);
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
          {/* Domain */}
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

          {/* Project Name */}
          <div className="col-md-3 mb-2 position-relative">
            <input
              type="text"
              name="projectName"
              className="form-control"
              placeholder="Project Name"
              value={formData.projectName}
              onChange={handleChange}
              required
            />
            {urbanProjects.length > 0 && (
              <div className="position-absolute d-flex flex-column overflow-y-auto bg-white z-3 w-100 border border-1 rounded-2 shadow" style={{ maxHeight: 200 }}>
                {urbanProjects.map((e) => (
                  <div key={e._id} className="p-2 border-bottom border-light-subtle onHover"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        projectId: e._id,
                        projectName: e.name
                      });
                      setUrbanProjects([]);
                    }}>
                    {e.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* City */}
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

          {/* Status */}
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

          {/* Template selection */}
          <div className="col-md-2 mb-2">
            <select
              name="templateRepo"
              className="form-select"
              value={formData.templateRepo}
              onChange={handleChange}
            >
              <option value="">Default Template</option>
              <option value="https://github.com/Urbanpiller/sample-project.git">Sample Project</option>
              {projects.map(p => (
                p.githubRepo && p._id !== formData.projectId && (
                  <option key={p._id} value={p.githubRepo}>{p.projectName}</option>
                )
              ))}
            </select>
          </div>
        </div>

        {/* Template Preview */}
        {templatePreview && (
          <div className="mt-2 p-2 border border-light rounded-2 bg-light">
            <strong>Template Preview:</strong>
            <iframe
              src={templatePreview}
              title="Template Preview"
              style={{ width: '100%', height: 400, border: '1px solid #ccc', marginTop: 8 }}
            />
          </div>
        )}

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
                    <td><a href={`http://${project.domain}`} target="_blank" rel="noreferrer">{project.domain}</a></td>
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

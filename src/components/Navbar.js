import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-black">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Microsite Dashboard</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><Link className="nav-link" to="/">Projects</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/leads">Leads</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/domain-emails">Domain Emails</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/visit-logs">Visitor Logs</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

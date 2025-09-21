import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Projects from './components/Projects';
import Leads from './components/Leads';
import DomainEmails from './components/DomainEmails';
import VisitLogs from './components/VisitLogs';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Projects />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/domain-emails" element={<DomainEmails />} />
          <Route path="/visit-logs" element={<VisitLogs />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

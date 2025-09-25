import React, { useEffect, useState } from "react";

const WS_URL = "wss://safebridge.urbanpillar.info/ws"; // replace with your WS server

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [visits, setVisits] = useState([]);
  const [suspicious, setSuspicious] = useState([]);
  const [deployments, setDeployments] = useState([]);

  useEffect(() => {
    let ws;

    function connect() {
      ws = new WebSocket(WS_URL);

      ws.onopen = () => console.log("Connected to WS");
      ws.onmessage = (msg) => {
        const { topic, data } = JSON.parse(msg.data);
        switch (topic) {
          case "leads": setLeads(prev => [data, ...prev].slice(0, 50)); break;
          case "visits": setVisits(prev => [data, ...prev].slice(0, 50)); break;
          case "suspicious-events": setSuspicious(prev => [data, ...prev].slice(0, 50)); break;
          case "deployments": setDeployments(prev => [data, ...prev].slice(0, 50)); break;
          default:
            console.warn(`Unknown topic received: ${topic}`);
            break;
        }
      };

      ws.onclose = () => {
        console.log("WS disconnected, retry in 5s");
        setTimeout(connect, 5000);
      };
      ws.onerror = (err) => console.error("WS error", err);
    }

    connect();

    return () => ws.close();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>UrbanPillar Microsite Dashboard</h1>

      {/* Leads */}
      <section>
        <h2>Recent Leads</h2>
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Domain</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l, i) => (
              <tr key={i}>
                <td>{l.name}</td>
                <td>{l.email}</td>
                <td>{l.phone}</td>
                <td>{l.projectDomain}</td>
                <td>{new Date(l.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Visits */}
      <section>
        <h2>Recent Visits</h2>
        <div class="table-responsive">
          <table class="table">
            <thead class="table-dark">
              <tr>
                <th>IP</th>
                <th>Browser</th>
                <th>OS</th>
                <th>Device</th>
                <th>Project</th>
                <th>Location</th>
                <th>Path</th>
                <th>Method</th>
                <th>Status</th>
                <th>Referer</th>
                <th>Suspicious</th>
                <th>ASN Org</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Area</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {visits.map((v, i) => (
                <tr key={i}>
                  <td>{v.ip}</td>
                  <td>{v.browser}</td>
                  <td>{v.os}</td>
                  <td>{v.device}</td>
                  <td>{v.projectDomain}</td>
                  <td>{v.city}, {v.region}, {v.country}</td>
                  <td>{v.path}</td>
                  <td>{v.method}</td>
                  <td>{v.status}</td>
                  <td>{v.referer}</td>
                  <td>{v.suspicious ? 'Yes' : 'No'}</td>
                  <td>{v.asnOrg}</td>
                  <td>{v.latitude ?? '-'}</td>
                  <td>{v.longitude ?? '-'}</td>
                  <td>{v.area || '-'}</td>
                  <td>{new Date(v.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Suspicious */}
      <section>
        <h2>Suspicious Events</h2>
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>IP</th>
              <th>Reason</th>
              <th>Origin</th>
              <th>Referer</th>
              <th>User Agent</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {suspicious.map((s, i) => (
              <tr key={i}>
                <td>{s.ip}</td>
                <td>{s.reason}</td>
                <td>{s.origin}</td>
                <td>{s.referer}</td>
                <td>{s.userAgent}</td>
                <td>{new Date(s.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Deployments & GitHub */}
      <section>
        <h2>Deployments & GitHub Status</h2>
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Domain</th>
              <th>Status</th>
              <th>Stars</th>
              <th>Forks</th>
              <th>Watchers</th>
              <th>Last Updated</th>
              <th>Repo</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {deployments.map((d, i) => (
              <tr key={i}>
                <td>{d.projectDomain}</td>
                <td>{d.status}</td>
                <td>{d.github?.stars}</td>
                <td>{d.github?.forks}</td>
                <td>{d.github?.watchers}</td>
                <td>{new Date(d.github?.lastUpdated).toLocaleString()}</td>
                <td>
                  {d.github?.repoUrl ? (
                    <a href={d.github.repoUrl} target="_blank" rel="noreferrer">
                      Repo Link
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td>{new Date(d.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

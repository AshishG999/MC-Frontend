import React, { useEffect, useState } from 'react';

const WS_URL = "wss://safebridge.urbanpillar.info/ws"; // replace with your WS server

function DeploymentLogs({ domain }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
      let ws;
  
      function connect() {
        ws = new WebSocket(WS_URL);
  
        ws.onopen = () => console.log("Connected to WS");
        ws.onmessage = (msg) => {
          const { topic, data } = JSON.parse(msg.data);
          switch (topic) {
            case "deployments": setLogs(prev => [data, ...prev]); break;
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
    <div className="border rounded p-2 mt-3" style={{ maxHeight: 300, overflowY: 'auto', background: '#f8f9fa' }}>
      <strong>Live Deployment Logs:</strong>
      <ul className="list-unstyled mb-0">
        {logs.map((log, idx) => (
          <li key={idx} style={{ color: log.type === 'error' ? 'red' : 'black', fontFamily: 'monospace' }}>
            [{new Date(log.timestamp).toLocaleTimeString()}] {log.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DeploymentLogs;

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import { createGlobalStyle } from 'styled-components';

// Global styles
const GlobalStyle = createGlobalStyle`
  :root {
    --primary: #00b4d8;
    --primary-dark: #0077b6;
    --primary-light: #90e0ef;
    --secondary: #7209b7;
    --secondary-light: #9d4edd;
    --background: #0a0a1b;
    --surface: #1a1a2e;
    --surface-light: #2a2a3e;
    --danger: #e63946;
    --success: #06d6a0;
    --warning: #ffd166;
    
    --text-primary: #ffffff;
    --text-secondary: #d1d5db;
    --text-tertiary: #9ca3af;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Roboto', sans-serif;
    background-color: var(--background);
    color: var(--text-primary);
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Exo', sans-serif;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    font-family: 'Exo', sans-serif;
    border: none;
    outline: none;
    cursor: pointer;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: var(--surface);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--primary-dark);
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--primary);
  }

  /* For Firefox */
  * {
    scrollbar-width: thin;
    scrollbar-color: var(--primary-dark) var(--surface);
  }
`;

// Set up API mocking for development
if (process.env.NODE_ENV === 'development') {
  const setupMockAPI = () => {
    console.log('Setting up mock API responses for development');
    
    // Setup mock fetch responses
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
      // For testing - log all API calls
      console.log(`API Call: ${url}`, options);
      
      // If fetching from a real server, pass through
      if (url.startsWith('http')) {
        return originalFetch(url, options);
      }
      
      // Check if we should mock the response
      if (url.includes('/api/metrics')) {
        return Promise.resolve({
          json: () => Promise.resolve({
            traffic_rate: Math.floor(Math.random() * 100 + 50),
            avg_response_time: Math.floor(Math.random() * 100 + 20),
            security_score: Math.floor(Math.random() * 15 + 80),
            traffic_history: Array.from({ length: 24 }, (_, i) => ({
              timestamp: `${23 - i}:00`,
              value: Math.floor(Math.random() * 100 + 50)
            })).reverse(),
            threat_distribution: [
              { type: 'Intrusion', count: Math.floor(Math.random() * 10 + 5) },
              { type: 'DDoS', count: Math.floor(Math.random() * 5 + 2) },
              { type: 'Malware', count: Math.floor(Math.random() * 8 + 3) },
              { type: 'Phishing', count: Math.floor(Math.random() * 12 + 6) }
            ]
          }),
          ok: true
        });
      } 
      else if (url.includes('/api/threats')) {
        return Promise.resolve({
          json: () => Promise.resolve(Array.from({ length: 5 }, (_, i) => ({
            id: i + 1,
            type: ['Intrusion Attempt', 'Suspicious Traffic', 'Port Scan', 'DDoS Attempt', 'Data Exfiltration'][Math.floor(Math.random() * 5)],
            source_ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
            timestamp: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString(),
            severity: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)],
            details: 'Suspicious activity detected on network'
          }))),
          ok: true
        });
      } 
      else if (url.includes('/api/anomalies')) {
        return Promise.resolve({
          json: () => Promise.resolve(Array.from({ length: 3 }, (_, i) => ({
            id: i + 1,
            type: ['Traffic Spike', 'Unusual Port Activity', 'Protocol Anomaly', 'Connection Pattern', 'Data Volume Anomaly'][Math.floor(Math.random() * 5)],
            timestamp: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString(),
            severity: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
            affected_metric: ['Bandwidth', 'Connection Count', 'Protocol Distribution'][Math.floor(Math.random() * 3)],
            details: 'Unusual pattern detected in network traffic'
          }))),
          ok: true
        });
      } 
      else if (url.includes('/api/status')) {
        return Promise.resolve({
          json: () => Promise.resolve({
            active: Math.random() > 0.5,
            packets_captured: Math.floor(Math.random() * 5000 + 1000),
            duration: Math.floor(Math.random() * 300 + 60),
            packets_per_second: Math.floor(Math.random() * 50 + 10)
          }),
          ok: true
        });
      } 
      else if (url.includes('/api/start_analysis') || url.includes('/api/stop_analysis')) {
        return Promise.resolve({
          json: () => Promise.resolve({
            message: url.includes('start') ? 'Analysis started successfully' : 'Analysis stopped successfully',
            status: 'success'
          }),
          ok: true
        });
      } 
      else if (url.includes('/api/security/overview')) {
        return Promise.resolve({
          json: () => Promise.resolve({
            security_score: Math.floor(Math.random() * 15 + 80),
            active_threats: Math.floor(Math.random() * 5),
            vulnerabilities_count: Math.floor(Math.random() * 10 + 5),
            protected_assets: Math.floor(Math.random() * 5 + 10),
            last_threat_time: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString(),
            security_status: Math.random() > 0.7 ? 'Good' : 'Fair'
          }),
          ok: true
        });
      } 
      else if (url.includes('/api/security/vulnerabilities')) {
        return Promise.resolve({
          json: () => Promise.resolve(Array.from({ length: 7 }, (_, i) => ({
            cve_id: `CVE-2024-${1000 + i}`,
            severity: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)],
            description: ['Remote code execution vulnerability', 'SQL injection vulnerability', 'Cross-site scripting vulnerability', 'Authentication bypass vulnerability'][Math.floor(Math.random() * 4)],
            affected_component: ['API Gateway', 'Web Frontend', 'Database', 'Authentication Service'][Math.floor(Math.random() * 4)],
            status: ['Open', 'In Progress', 'Resolved'][Math.floor(Math.random() * 3)],
            discovery_date: new Date(Date.now() - Math.floor(Math.random() * 30 * 86400000)).toISOString(),
            remediation: 'Update to the latest version and apply security patches'
          }))),
          ok: true
        });
      }
      
      // If no mock is defined, pass through to the actual fetch
      return originalFetch(url, options);
    };
  };

  setupMockAPI();
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GlobalStyle />
    <App />
  </React.StrictMode>
);
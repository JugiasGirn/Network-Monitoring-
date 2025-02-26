import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { BarChart, XAxis, YAxis, Tooltip, Bar, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  Shield, 
  AlertTriangle, 
  Clock, 
  Server, 
  RefreshCw, 
  Download, 
  Filter, 
  ArrowUpRight, 
  Database, 
  Lock,
  Zap
} from 'lucide-react';
import { API_BASE_URL } from "../app";

// Styled Components
const PageContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
`;

const PageHeader = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const HeaderContent = styled.div`
  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    background: linear-gradient(90deg, #ff5e62, #ff9966);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 30px rgba(255, 94, 98, 0.5);
  }

  p {
    color: var(--text-secondary);
    font-size: 1.1rem;
  }
`;

const TimeframeSelector = styled.div`
  display: flex;
  background: rgba(26, 26, 46, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 0.3rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const TimeButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  background: ${props => props.active ? 'rgba(255, 94, 98, 0.2)' : 'transparent'};
  color: ${props => props.active ? 'var(--primary)' : 'var(--text-tertiary)'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Exo', sans-serif;
  
  &:hover {
    color: ${props => props.active ? 'var(--primary)' : 'var(--text-secondary)'};
  }
`;

const SecurityScoreCard = styled(motion.div)`
  background: rgba(26, 26, 46, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: ${props => {
      if (props.score >= 80) return 'var(--success)';
      if (props.score >= 60) return 'var(--warning)';
      return 'var(--danger)';
    }};
    box-shadow: 0 0 10px ${props => {
      if (props.score >= 80) return 'var(--success)';
      if (props.score >= 60) return 'var(--warning)';
      return 'var(--danger)';
    }};
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const ScoreInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  .score-circle {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    font-weight: 700;
    color: ${props => {
      if (props.score >= 80) return 'var(--success)';
      if (props.score >= 60) return 'var(--warning)';
      return 'var(--danger)';
    }};
    background: radial-gradient(
      circle,
      rgba(26, 26, 46, 0.8) 0%,
      rgba(26, 26, 46, 0.6) 100%
    );
    border: 2px solid ${props => {
      if (props.score >= 80) return 'var(--success)';
      if (props.score >= 60) return 'var(--warning)';
      return 'var(--danger)';
    }};
    box-shadow: 0 0 20px ${props => {
      if (props.score >= 80) return 'rgba(52, 211, 153, 0.3)';
      if (props.score >= 60) return 'rgba(251, 191, 36, 0.3)';
      return 'rgba(239, 68, 68, 0.3)';
    }};
  }

  .score-details {
    h2 {
      font-size: 1.8rem;
      margin-bottom: 0.5rem;
      color: ${props => {
        if (props.score >= 80) return 'var(--success)';
        if (props.score >= 60) return 'var(--warning)';
        return 'var(--danger)';
      }};
    }

    p {
      color: var(--text-secondary);
      font-size: 1rem;
      max-width: 350px;
    }
  }
`;

const SecurityMetrics = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const MetricItem = styled.div`
  text-align: center;

  .metric-value {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.3rem;
  }

  .metric-label {
    font-size: 0.85rem;
    color: var(--text-tertiary);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(motion.div)`
  background: rgba(26, 26, 46, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: ${props => props.color || 'var(--primary)'};
    box-shadow: 0 0 10px ${props => props.color || 'var(--primary)'};
  }
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;

  .title {
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  .value {
    font-size: 1.6rem;
    font-weight: 700;
    font-family: 'Exo', sans-serif;
    color: var(--text-primary);
  }

  .icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    background: rgba(10, 10, 27, 0.6);
    border-radius: 10px;
    color: ${props => props.color || 'var(--primary)'};
  }
`;

const StatTrend = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  color: ${props => props.positive ? 'var(--success)' : 'var(--danger)'};

  svg {
    margin-right: 0.3rem;
  }
`;

const SecurityChartGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled(motion.div)`
  background: rgba(26, 26, 46, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  overflow: hidden;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  h3 {
    color: ${props => props.color || 'var(--primary)'};
    font-size: 1.2rem;
    margin: 0;
  }
`;

const ChartActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-secondary);
  border: none;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--primary);
  }
`;

const ChartContent = styled.div`
  padding: 1.5rem;
`;

const AlertsTable = styled.div`
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 2rem;
  background: rgba(26, 26, 46, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  h3 {
    color: var(--danger);
    font-size: 1.2rem;
    margin: 0;
  }
`;

const TableContent = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 1rem 1.5rem;
    text-align: left;
  }
  
  th {
    background: rgba(10, 10, 27, 0.6);
    color: var(--text-secondary);
    font-weight: 600;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  tr:not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  tbody tr {
    transition: background 0.2s;
    
    &:hover {
      background: rgba(255, 255, 255, 0.02);
    }
  }
`;

const AlertBadge = styled.span`
  display: inline-block;
  padding: 0.3rem 0.7rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => {
    if (props.severity === 'Critical') return 'rgba(239, 68, 68, 0.2)';
    if (props.severity === 'High') return 'rgba(251, 146, 60, 0.2)';
    if (props.severity === 'Medium') return 'rgba(251, 191, 36, 0.2)';
    return 'rgba(156, 163, 175, 0.2)';
  }};
  color: ${props => {
    if (props.severity === 'Critical') return 'var(--danger)';
    if (props.severity === 'High') return 'var(--warning)';
    if (props.severity === 'Medium') return 'var(--warning-light)';
    return 'var(--text-secondary)';
  }};
  border: 1px solid ${props => {
    if (props.severity === 'Critical') return 'rgba(239, 68, 68, 0.3)';
    if (props.severity === 'High') return 'rgba(251, 146, 60, 0.3)';
    if (props.severity === 'Medium') return 'rgba(251, 191, 36, 0.3)';
    return 'rgba(156, 163, 175, 0.3)';
  }};
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.3rem 0.7rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => {
    if (props.status === 'New') return 'rgba(239, 68, 68, 0.2)';
    if (props.status === 'Investigating') return 'rgba(251, 191, 36, 0.2)';
    if (props.status === 'Resolved') return 'rgba(52, 211, 153, 0.2)';
    return 'rgba(156, 163, 175, 0.2)';
  }};
  color: ${props => {
    if (props.status === 'New') return 'var(--danger)';
    if (props.status === 'Investigating') return 'var(--warning)';
    if (props.status === 'Resolved') return 'var(--success)';
    return 'var(--text-secondary)';
  }};
  border: 1px solid ${props => {
    if (props.status === 'New') return 'rgba(239, 68, 68, 0.3)';
    if (props.status === 'Investigating') return 'rgba(251, 191, 36, 0.3)';
    if (props.status === 'Resolved') return 'rgba(52, 211, 153, 0.3)';
    return 'rgba(156, 163, 175, 0.3)';
  }};
`;

const VulnerabilitiesGrid = styled(SecurityChartGrid)`
  grid-template-columns: 2fr 1fr;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const AssetsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
`;

const AssetItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(10, 10, 27, 0.3);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.03);

  .asset-info {
    display: flex;
    align-items: center;
    gap: 1rem;

    .asset-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.05);
      color: ${props => {
        if (props.level === 'Critical') return 'var(--danger)';
        if (props.level === 'High') return 'var(--warning)';
        return 'var(--primary)';
      }};
    }

    .asset-details {
      h4 {
        margin: 0 0 0.2rem;
        font-size: 1rem;
      }

      .asset-type {
        font-size: 0.8rem;
        color: var(--text-tertiary);
      }
    }
  }

  .asset-protection {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .protection-level {
      font-size: 0.85rem;
      font-weight: 600;
      color: ${props => {
        if (props.level === 'Critical') return 'var(--danger)';
        if (props.level === 'High') return 'var(--warning)';
        return 'var(--primary)';
      }};
    }
  }
`;

// Main component
const Security = () => {
  const [securityOverview, setSecurityOverview] = useState({
    security_score: 85,
    active_threats: 2,
    vulnerabilities_count: 3,
    protected_assets: 5,
    last_threat_time: new Date().toISOString(),
    security_status: "Good"
  });
  // We'll keep the state but not use it directly in this version
  const [, setThreats] = useState([]);
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [protectedAssets, setProtectedAssets] = useState([]);
  const [securityAlerts, setSecurityAlerts] = useState([]);
  const [timeFrame, setTimeFrame] = useState('24h');
  const [isLoading, setIsLoading] = useState(true);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };
  
  // Function to format date/time
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  // Function to calculate time since last threat
  const getTimeSinceLastThreat = (isoString) => {
    const threatTime = new Date(isoString);
    const now = new Date();
    const diffMs = now - threatTime;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHrs < 1) {
      return "Less than an hour ago";
    } else if (diffHrs < 24) {
      return `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`;
    } else {
      const diffDays = Math.floor(diffHrs / 24);
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }
  };
  
  useEffect(() => {
    const fetchSecurityData = async () => {
      setIsLoading(true);
      try {
        // Try to fetch real data from API
        const [overviewRes, threatsRes, vulnerabilitiesRes, assetsRes, alertsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/security/overview?timeframe=${timeFrame}`),
          fetch(`${API_BASE_URL}/api/security/threats?timeframe=${timeFrame}`),
          fetch(`${API_BASE_URL}/api/security/vulnerabilities`),
          fetch(`${API_BASE_URL}/api/security/protected-assets`),
          fetch(`${API_BASE_URL}/api/security/alerts?timeframe=${timeFrame}`)
        ]);
        
        let overviewData, threatsData, vulnerabilitiesData, assetsData, alertsData;
        
        // Process each response - fallback to demo data if API call fails
        if (overviewRes.ok) {
          overviewData = await overviewRes.json();
        } else {
          // If API call fails, use demo data
          overviewData = {
            security_score: 85,
            active_threats: 2,
            vulnerabilities_count: 3,
            protected_assets: 5,
            last_threat_time: new Date().toISOString(),
            security_status: "Good"
          };
        }
        
        if (threatsRes.ok) {
          threatsData = await threatsRes.json();
        } else {
          // Generate demo threat data
          threatsData = generateMockThreats();
        }
        
        if (vulnerabilitiesRes.ok) {
          vulnerabilitiesData = await vulnerabilitiesRes.json();
        } else {
          // Use demo vulnerability data
          vulnerabilitiesData = [
            {
              "cve_id": "CVE-2024-1234",
              "severity": "Critical",
              "description": "Remote code execution vulnerability in authentication module",
              "affected_component": "Auth Service",
              "status": "Open",
              "discovery_date": new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
              "remediation": "Apply security patch #A-257"
            },
            {
              "cve_id": "CVE-2024-5678",
              "severity": "High",
              "description": "SQL injection vulnerability in user input validation",
              "affected_component": "API Gateway",
              "status": "In Progress",
              "discovery_date": new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              "remediation": "Implement input sanitization and prepared statements"
            },
            {
              "cve_id": "CVE-2024-9012",
              "severity": "Medium",
              "description": "Cross-site scripting vulnerability in form submission",
              "affected_component": "Web Frontend",
              "status": "Open",
              "discovery_date": new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              "remediation": "Implement content security policy and input validation"
            }
          ];
        }
        
        if (assetsRes.ok) {
          assetsData = await assetsRes.json();
        } else {
          // Use demo assets data
          assetsData = [
            {
              "name": "Web Server",
              "type": "Service",
              "protection_level": "High",
              "last_scan": new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
            },
            {
              "name": "Database",
              "type": "Data Storage",
              "protection_level": "Critical",
              "last_scan": new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
            },
            {
              "name": "API Gateway",
              "type": "Service",
              "protection_level": "High",
              "last_scan": new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
            },
            {
              "name": "Authentication Service",
              "type": "Service",
              "protection_level": "Critical",
              "last_scan": new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
            },
            {
              "name": "User Data",
              "type": "Data",
              "protection_level": "Critical",
              "last_scan": new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
            }
          ];
        }
        
        if (alertsRes.ok) {
          alertsData = await alertsRes.json();
        } else {
          // Generate demo security alerts
          alertsData = generateMockAlerts();
        }
        
        // Update state with fetched or demo data
        setSecurityOverview(overviewData);
        setThreats(threatsData);
        setVulnerabilities(vulnerabilitiesData);
        setProtectedAssets(assetsData);
        setSecurityAlerts(alertsData);
        
      } catch (error) {
        console.error('Error fetching security data:', error);
        
        // Fallback to demo data on error
        setSecurityOverview({
          security_score: 85,
          active_threats: 2,
          vulnerabilities_count: 3,
          protected_assets: 5,
          last_threat_time: new Date().toISOString(),
          security_status: "Good"
        });
        setThreats(generateMockThreats());
        setVulnerabilities([
          {
            "cve_id": "CVE-2024-1234",
            "severity": "Critical",
            "description": "Remote code execution vulnerability in authentication module",
            "affected_component": "Auth Service",
            "status": "Open",
            "discovery_date": new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            "remediation": "Apply security patch #A-257"
          },
          {
            "cve_id": "CVE-2024-5678",
            "severity": "High",
            "description": "SQL injection vulnerability in user input validation",
            "affected_component": "API Gateway",
            "status": "In Progress",
            "discovery_date": new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            "remediation": "Implement input sanitization and prepared statements"
          },
          {
            "cve_id": "CVE-2024-9012",
            "severity": "Medium",
            "description": "Cross-site scripting vulnerability in form submission",
            "affected_component": "Web Frontend",
            "status": "Open",
            "discovery_date": new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            "remediation": "Implement content security policy and input validation"
          }
        ]);
        setProtectedAssets([
          {
            "name": "Web Server",
            "type": "Service",
            "protection_level": "High",
            "last_scan": new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
          },
          {
            "name": "Database",
            "type": "Data Storage",
            "protection_level": "Critical",
            "last_scan": new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
          },
          {
            "name": "API Gateway",
            "type": "Service",
            "protection_level": "High",
            "last_scan": new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
          },
          {
            "name": "Authentication Service",
            "type": "Service",
            "protection_level": "Critical",
            "last_scan": new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
          },
          {
            "name": "User Data",
            "type": "Data",
            "protection_level": "Critical",
            "last_scan": new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
          }
        ]);
        setSecurityAlerts(generateMockAlerts());
      } finally {
        setIsLoading(false);
      }
    };

    fetchSecurityData();
  }, [timeFrame]);
  
  // Function to generate mock threats data
  const generateMockThreats = () => {
    const threatTypes = [
      "Intrusion Attempt", 
      "Suspicious Traffic", 
      "Port Scan", 
      "DDoS Attempt", 
      "Data Exfiltration",
      "Brute Force Attack",
      "Malware Communication"
    ];
    
    const severities = ["Low", "Medium", "High", "Critical"];
    const threats = [];
    
    // Generate 0-3 threats
    const numThreats = Math.floor(Math.random() * 4);
    
    for (let i = 0; i < numThreats; i++) {
      const threatType = threatTypes[Math.floor(Math.random() * threatTypes.length)];
      const severity = severities[Math.floor(Math.random() * severities.length)];
      const sourceIp = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      
      let details = "";
      if (threatType === "Intrusion Attempt") {
        details = "Multiple failed authentication attempts detected";
      } else if (threatType === "Suspicious Traffic") {
        details = "Unusual outbound traffic pattern detected";
      } else if (threatType === "Port Scan") {
        details = `Sequential port scanning from ${sourceIp}`;
      } else if (threatType === "DDoS Attempt") {
        details = "High volume of incoming connection requests";
      } else if (threatType === "Data Exfiltration") {
        details = "Large volume of data being sent to external server";
      } else if (threatType === "Brute Force Attack") {
        details = "Repeated login attempts with different credentials";
      } else if (threatType === "Malware Communication") {
        details = "Communication with known malicious IP address";
      }
      
      threats.push({
        id: i + 1,
        type: threatType,
        source_ip: sourceIp,
        timestamp: new Date().toISOString(),
        severity: severity,
        details: details
      });
    }
    
    return threats;
  };
  
  // Function to generate mock security alerts
  const generateMockAlerts = () => {
    const alertTypes = [
      "Authentication Failure",
      "Unusual Access Pattern",
      "Port Scanning",
      "Suspicious Outbound Connection",
      "DDoS Attempt",
      "Malware Signature Detected",
      "Data Exfiltration Attempt"
    ];
    
    const severityMap = {
      "Authentication Failure": "Medium",
      "Unusual Access Pattern": "Low",
      "Port Scanning": "Medium",
      "Suspicious Outbound Connection": "High",
      "DDoS Attempt": "Critical",
      "Malware Signature Detected": "Critical",
      "Data Exfiltration Attempt": "High"
    };
    
    const statusOptions = ["New", "Investigating", "Resolved", "False Positive"];
    const alerts = [];
    
    const numAlerts = Math.floor(Math.random() * 8) + 3; // 3-10 alerts
    
    for (let i = 0; i < numAlerts; i++) {
      const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
      const sourceIp = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      const destinationIp = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      const severity = severityMap[alertType];
      const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
      
      // Generate timestamp within the last 24 hours
      const timestamp = new Date(Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000)).toISOString();
      
      // Generate specific details based on alert type
      let details = "";
      if (alertType === "Authentication Failure") {
        details = `Multiple failed login attempts from ${sourceIp}`;
      } else if (alertType === "Unusual Access Pattern") {
        details = `Abnormal access time or pattern from ${sourceIp}`;
      } else if (alertType === "Port Scanning") {
        details = `Sequential port scan detected from ${sourceIp}`;
      } else if (alertType === "Suspicious Outbound Connection") {
        details = `Connection to blacklisted IP: ${destinationIp}`;
      } else if (alertType === "DDoS Attempt") {
        details = `High volume of traffic from multiple sources to ${destinationIp}`;
      } else if (alertType === "Malware Signature Detected") {
        details = `Known malware signature detected in traffic from ${sourceIp}`;
      } else if (alertType === "Data Exfiltration Attempt") {
        details = `Large data transfer to external IP: ${destinationIp}`;
      }
      
      alerts.push({
        id: i + 1,
        type: alertType,
        source_ip: sourceIp,
        destination_ip: destinationIp,
        timestamp: timestamp,
        severity: severity,
        details: details,
        status: status
      });
    }
    
    // Sort by timestamp (newest first)
    alerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    return alerts;
  };
  
  // Function to create chart tooltip styles
  const tooltipStyle = {
    contentStyle: { 
      backgroundColor: 'var(--surface)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      color: 'var(--text-primary)'
    },
    itemStyle: { color: 'var(--text-primary)' },
    labelStyle: { color: 'var(--text-secondary)' }
  };
  
  // We'll keep this commented for future reference if needed
  /* 
  const vulnerabilitiesByComponent = () => {
    const componentMap = {};
    
    vulnerabilities.forEach(vuln => {
      if (!componentMap[vuln.affected_component]) {
        componentMap[vuln.affected_component] = { component: vuln.affected_component, count: 0 };
      }
      componentMap[vuln.affected_component].count++;
    });
    
    return Object.values(componentMap);
  };
  */
  
  // Transform vulnerabilities data by severity
  const vulnerabilitiesBySeverity = () => {
    const counts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    
    vulnerabilities.forEach(vuln => {
      counts[vuln.severity]++;
    });
    
    return [
      { name: 'Critical', value: counts.Critical, color: 'var(--danger)' },
      { name: 'High', value: counts.High, color: 'var(--warning)' },
      { name: 'Medium', value: counts.Medium, color: 'var(--warning-light)' },
      { name: 'Low', value: counts.Low, color: 'var(--success)' }
    ];
  };
  
  // Transform alerts data for trend analysis
  const alertsTrend = () => {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000);
    
    // Create hour buckets with initial random distribution
    const hourBuckets = Array(24).fill(0).map(() => Math.floor(Math.random() * 5));
    
    // Make sure we have more significant data points by adding higher values in a few places
    const peakHours = [9, 13, 17, 21]; // Common peak activity hours
    peakHours.forEach(hour => {
      const index = (hour + 24 - now.getHours()) % 24;
      hourBuckets[index] = Math.floor(Math.random() * 15) + 5; // 5-20 alerts
    });
    
    // Add some random spikes
    const randomSpikes = 2;
    for (let i = 0; i < randomSpikes; i++) {
      const randomHour = Math.floor(Math.random() * 24);
      hourBuckets[randomHour] = Math.floor(Math.random() * 10) + 15; // 15-25 alerts
    }
    
    // Add real alerts from securityAlerts data
    securityAlerts.forEach(alert => {
      const alertTime = new Date(alert.timestamp);
      if (alertTime >= twentyFourHoursAgo) {
        const hourDiff = 23 - Math.floor((now - alertTime) / (60 * 60 * 1000));
        if (hourDiff >= 0 && hourDiff < 24) {
          hourBuckets[hourDiff] += 1;
        }
      }
    });
    
    const result = [];
    for (let i = 0; i < 24; i++) {
      const displayHour = (now.getHours() - 23 + i + 24) % 24;
      result.push({
        hour: `${displayHour}:00`,
        alerts: hourBuckets[i]
      });
    }
    
    return result;
  };
  
  return (
    <PageContainer>
      <PageHeader
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <HeaderContent>
          <h1>Security Dashboard</h1>
          <p>Real-time security monitoring and threat detection</p>
        </HeaderContent>
        
        <TimeframeSelector>
          <TimeButton 
            active={timeFrame === '24h'} 
            onClick={() => setTimeFrame('24h')}
          >
            24h
          </TimeButton>
          <TimeButton 
            active={timeFrame === '7d'} 
            onClick={() => setTimeFrame('7d')}
          >
            7d
          </TimeButton>
          <TimeButton 
            active={timeFrame === '30d'} 
            onClick={() => setTimeFrame('30d')}
          >
            30d
          </TimeButton>
        </TimeframeSelector>
      </PageHeader>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Security Score Card */}
        <SecurityScoreCard 
          variants={itemVariants}
          score={securityOverview.security_score}
        >
          <ScoreInfo score={securityOverview.security_score}>
            <div className="score-circle">
              {securityOverview.security_score}
            </div>
            <div className="score-details">
              <h2>Security Score: {securityOverview.security_status}</h2>
              <p>
                {securityOverview.security_score >= 80 ? 
                  "Your system's security is in good standing. Continue monitoring for potential threats." :
                  securityOverview.security_score >= 60 ?
                  "Your system has some security concerns that should be addressed soon." :
                  "Urgent attention required. Your system has critical security vulnerabilities."
                }
              </p>
            </div>
          </ScoreInfo>
          
          <SecurityMetrics>
            <MetricItem>
              <div className="metric-value">{securityOverview.active_threats}</div>
              <div className="metric-label">
                <AlertTriangle size={16} />
                Active Threats
              </div>
            </MetricItem>
            
            <MetricItem>
              <div className="metric-value">{securityOverview.vulnerabilities_count}</div>
              <div className="metric-label">
                <Shield size={16} />
                Vulnerabilities
              </div>
            </MetricItem>
            
            <MetricItem>
              <div className="metric-value">{securityOverview.protected_assets}</div>
              <div className="metric-label">
                <Lock size={16} />
                Protected Assets
              </div>
            </MetricItem>
          </SecurityMetrics>
        </SecurityScoreCard>
        
        {/* Stats Row */}
        <StatsGrid>
          <StatCard 
            variants={itemVariants}
            color="var(--danger)"
          >
            <StatHeader color="var(--danger)">
              <div>
                <div className="title">Last Threat Detected</div>
                <div className="value">{getTimeSinceLastThreat(securityOverview.last_threat_time)}</div>
              </div>
              <div className="icon-container">
                <AlertTriangle size={24} />
              </div>
            </StatHeader>
            <StatTrend positive={false}>
              <Clock size={16} /> {formatDateTime(securityOverview.last_threat_time)}
            </StatTrend>
          </StatCard>
          
          <StatCard 
            variants={itemVariants}
            color="var(--warning)"
          >
            <StatHeader color="var(--warning)">
              <div>
                <div className="title">Suspicious Traffic</div>
                <div className="value">24%</div>
              </div>
              <div className="icon-container">
                <Zap size={24} />
              </div>
            </StatHeader>
            <StatTrend positive={false}>
              <ArrowUpRight size={16} /> 8.3% from previous period
            </StatTrend>
          </StatCard>
          
          <StatCard 
            variants={itemVariants}
            color="var(--success)"
          >
            <StatHeader color="var(--success)">
              <div>
                <div className="title">Assets Secured</div>
                <div className="value">{protectedAssets.length}</div>
              </div>
              <div className="icon-container">
                <Server size={24} />
              </div>
            </StatHeader>
            <StatTrend positive={true}>
              <ArrowUpRight size={16} /> 100% protection coverage
            </StatTrend>
          </StatCard>
          
          <StatCard 
            variants={itemVariants}
            color="var(--primary)"
          >
            <StatHeader color="var(--primary)">
              <div>
                <div className="title">Critical Data Protected</div>
                <div className="value">
                  {protectedAssets.filter(asset => asset.protection_level === "Critical").length} / {protectedAssets.length}
                </div>
              </div>
              <div className="icon-container">
                <Database size={24} />
              </div>
            </StatHeader>
            <StatTrend positive={true}>
              <Lock size={16} /> Highest protection level
            </StatTrend>
          </StatCard>
        </StatsGrid>
        
        {/* Vulnerabilities Grid */}
        <SecurityChartGrid>
          <ChartCard variants={itemVariants}>
            <ChartHeader color="var(--danger)">
              <h3>Vulnerabilities</h3>
              <ChartActions>
                <IconButton
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <RefreshCw size={16} />
                </IconButton>
                <IconButton
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Download size={16} />
                </IconButton>
              </ChartActions>
            </ChartHeader>
            <TableContent>
              <Table>
                <thead>
                  <tr>
                    <th>CVE ID</th>
                    <th>Severity</th>
                    <th>Component</th>
                    <th>Status</th>
                    <th>Discovered</th>
                  </tr>
                </thead>
                <tbody>
                  {vulnerabilities.map((vuln, index) => (
                    <tr key={index}>
                      <td>{vuln.cve_id}</td>
                      <td>
                        <AlertBadge severity={vuln.severity}>
                          {vuln.severity}
                        </AlertBadge>
                      </td>
                      <td>{vuln.affected_component}</td>
                      <td>{vuln.status}</td>
                      <td>{new Date(vuln.discovery_date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableContent>
          </ChartCard>
          
          <ChartCard variants={itemVariants}>
            <ChartHeader color="var(--warning)">
              <h3>Vulnerability Distribution</h3>
              <ChartActions>
                <IconButton
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <RefreshCw size={16} />
                </IconButton>
              </ChartActions>
            </ChartHeader>
            <ChartContent>
              {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '250px' }}>
                  <RefreshCw size={30} className="animate-spin" style={{ color: 'var(--warning)' }} />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={vulnerabilitiesBySeverity()}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => entry.name}
                      labelLine={true}
                    >
                      {vulnerabilitiesBySeverity().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip {...tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </ChartContent>
          </ChartCard>
        </SecurityChartGrid>
        
        {/* Protected Assets Section */}
        <ChartCard variants={itemVariants}>
          <ChartHeader color="var(--success)">
            <h3>Protected Assets</h3>
            <ChartActions>
              <IconButton
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <RefreshCw size={16} />
              </IconButton>
            </ChartActions>
          </ChartHeader>
          <AssetsList>
            {protectedAssets.map((asset, index) => (
              <AssetItem key={index} level={asset.protection_level}>
                <div className="asset-info">
                  <div className="asset-icon">
                    {asset.type === 'Service' ? (
                      <Server size={20} />
                    ) : asset.type === 'Data Storage' ? (
                      <Database size={20} />
                    ) : (
                      <Lock size={20} />
                    )}
                  </div>
                  <div className="asset-details">
                    <h4>{asset.name}</h4>
                    <div className="asset-type">{asset.type}</div>
                  </div>
                </div>
                <div className="asset-protection">
                  <div className="protection-level">{asset.protection_level} Protection</div>
                  <div>·</div>
                  <div>Last scan: {new Date(asset.last_scan).toLocaleString()}</div>
                </div>
              </AssetItem>
            ))}
          </AssetsList>
        </ChartCard>
        
        {/* Alert Trend Chart */}
        <ChartCard variants={itemVariants} style={{ marginTop: '1.5rem' }}>
          <ChartHeader color="var(--primary)">
            <h3>Security Alert Trend (24h)</h3>
            <ChartActions>
              <IconButton
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <RefreshCw size={16} />
              </IconButton>
              <IconButton
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Download size={16} />
              </IconButton>
            </ChartActions>
          </ChartHeader>
          <ChartContent>
            {isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                <RefreshCw size={30} className="animate-spin" style={{ color: 'var(--primary)' }} />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={alertsTrend()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                  <XAxis dataKey="hour" stroke="var(--text-tertiary)" />
                  <YAxis stroke="var(--text-tertiary)" />
                  <Tooltip {...tooltipStyle} />
                  <Bar 
                    dataKey="alerts" 
                    fill="var(--primary)" 
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartContent>
        </ChartCard>
        
        {/* Security Alerts Table */}
        <AlertsTable variants={itemVariants}>
          <TableHeader>
            <h3>Recent Security Alerts</h3>
            <ChartActions>
              <IconButton
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Filter size={16} />
              </IconButton>
              <IconButton
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <RefreshCw size={16} />
              </IconButton>
            </ChartActions>
          </TableHeader>
          <TableContent>
            <Table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Source IP</th>
                  <th>Destination IP</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {securityAlerts.map((alert, index) => (
                  <tr key={index}>
                    <td>{alert.type}</td>
                    <td>{alert.source_ip}</td>
                    <td>{alert.destination_ip}</td>
                    <td>
                      <AlertBadge severity={alert.severity}>
                        {alert.severity}
                      </AlertBadge>
                    </td>
                    <td>
                      <StatusBadge status={alert.status}>
                        {alert.status}
                      </StatusBadge>
                    </td>
                    <td>{formatDateTime(alert.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableContent>
        </AlertsTable>
      </motion.div>
    </PageContainer>
  );
};

export default Security;

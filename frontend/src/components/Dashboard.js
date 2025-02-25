import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { LineChart, BarChart, AreaChart, XAxis, YAxis, Tooltip, Legend, Line, Bar, Area, ResponsiveContainer } from 'recharts';
import { Shield, Activity, AlertTriangle, Database, Radio, Server, BarChart2, Play, Pause, RefreshCw, Clock, Eye, Lock } from "lucide-react";
import { API_BASE_URL } from "../app";
import { Cpu } from "lucide-react";

// Styled Components
const PageContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
`;

const PageHeader = styled(motion.div)`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    background: linear-gradient(90deg, #00b4d8, #90e0ef);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 30px rgba(0, 180, 216, 0.5);
  }

  p {
    color: var(--text-secondary);
    font-size: 1.1rem;
  }
`;

const ControlsBar = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: rgba(26, 26, 46, 0.6);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const StatusDisplay = styled.div`
  display: flex;
  align-items: center;
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1rem;

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 0.5rem;
    background: ${props => props.active ? 'var(--success)' : 'var(--danger)'};
    box-shadow: 0 0 8px ${props => props.active ? 'var(--success)' : 'var(--danger)'};
    animation: ${props => props.active ? 'pulse 2s infinite' : 'none'};
  }

  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
  }

  .status {
    font-weight: 600;
    color: ${props => props.active ? 'var(--success)' : 'var(--danger)'};
  }
`;

const ControlsGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.2rem;
  background: ${props => props.primary ? 'linear-gradient(45deg, var(--primary), var(--primary-dark))' : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.primary ? 'white' : 'var(--text-secondary)'};
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: ${props => props.primary ? '0 4px 12px rgba(0, 180, 216, 0.3)' : 'none'};

  &:hover {
    background: ${props => props.primary ? 'linear-gradient(45deg, var(--primary-dark), var(--primary))' : 'rgba(255, 255, 255, 0.1)'};
    box-shadow: ${props => props.primary ? '0 4px 15px rgba(0, 180, 216, 0.4)' : 'none'};
  }
`;

const IconButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-secondary);
  border: none;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--primary);
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
  align-items: flex-start;
  margin-bottom: 1rem;

  .title {
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  .icon {
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    color: ${props => props.color || 'var(--primary)'};
  }
`;

const StatValue = styled.div`
  font-size: 2.2rem;
  font-weight: 700;
  font-family: 'Exo', sans-serif;
  color: var(--text-primary);
  margin-bottom: 0.5rem;

  .unit {
    font-size: 0.9rem;
    color: var(--text-tertiary);
    margin-left: 0.3rem;
  }
`;

const StatTrend = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  color: ${props => props.positive ? 'var(--success)' : 'var(--danger)'};

  .arrow {
    margin-right: 0.3rem;
  }
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
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
  height: 380px;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  h3 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
    color: ${props => props.color || 'var(--primary)'};
    font-size: 1.2rem;
  }
`;

const ChartControls = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ChartControlButton = styled.button`
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.active ? 'var(--primary)' : 'var(--text-tertiary)'};
  border: none;
  border-radius: 4px;
  padding: 0.3rem 0.8rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ChartBody = styled.div`
  padding: 1rem;
  height: calc(100% - 60px);
`;

const ThreatsFeed = styled(motion.div)`
  background: rgba(26, 26, 46, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  margin-bottom: 2rem;
  max-height: 500px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ThreatsHeader = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
    color: var(--danger);
    font-size: 1.2rem;
  }
`;

const ThreatsBody = styled.div`
  padding: 1rem 1.5rem;
  overflow-y: auto;
  max-height: 440px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;

  .icon {
    margin-bottom: 1rem;
    color: var(--success);
    opacity: 0.8;
  }

  h4 {
    color: var(--success);
    margin-bottom: 0.5rem;
    font-size: 1.3rem;
  }

  p {
    color: var(--text-tertiary);
    max-width: 400px;
    line-height: 1.5;
  }
`;

const ThreatAlert = styled(motion.div)`
  background: ${props => {
    switch(props.severity?.toLowerCase()) {
      case 'critical': return 'rgba(230, 57, 70, 0.1)';
      case 'high': return 'rgba(253, 128, 36, 0.1)';
      case 'medium': return 'rgba(255, 209, 102, 0.1)';
      case 'low': return 'rgba(63, 167, 214, 0.1)';
      default: return 'rgba(255, 255, 255, 0.05)';
    }
  }};
  border: 1px solid ${props => {
    switch(props.severity?.toLowerCase()) {
      case 'critical': return 'rgba(230, 57, 70, 0.3)';
      case 'high': return 'rgba(253, 128, 36, 0.3)';
      case 'medium': return 'rgba(255, 209, 102, 0.3)';
      case 'low': return 'rgba(63, 167, 214, 0.3)';
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  }};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const ThreatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
  
  .title {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-weight: 600;
    font-size: 1rem;
    color: ${props => {
      switch(props.severity?.toLowerCase()) {
        case 'critical': return 'var(--danger)';
        case 'high': return '#fd8024';
        case 'medium': return '#ffd166';
        case 'low': return '#3fa7d6';
        default: return 'var(--text-primary)';
      }
    }};
  
    .icon {
      color: inherit;
    }
  }
  
  .severity {
    background: ${props => {
      switch(props.severity?.toLowerCase()) {
        case 'critical': return 'rgba(230, 57, 70, 0.2)';
        case 'high': return 'rgba(253, 128, 36, 0.2)';
        case 'medium': return 'rgba(255, 209, 102, 0.2)';
        case 'low': return 'rgba(63, 167, 214, 0.2)';
        default: return 'rgba(255, 255, 255, 0.1)';
      }
    }};
    color: ${props => {
      switch(props.severity?.toLowerCase()) {
        case 'critical': return 'var(--danger)';
        case 'high': return '#fd8024';
        case 'medium': return '#ffd166';
        case 'low': return '#3fa7d6';
        default: return 'var(--text-primary)';
      }
    }};
    padding: 0.25rem 0.6rem;
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const ThreatInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-bottom: ${props => props.expanded ? '0.8rem' : '0'};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  .info-item {
    display: flex;
    align-items: center;
    font-size: 0.85rem;
    color: var(--text-tertiary);

    .label {
      margin-right: 0.3rem;
    }

    .value {
      color: var(--text-secondary);
      font-family: ${props => props.isCode ? 'monospace' : 'inherit'};
    }
  }
`;

const ThreatDetails = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: 0.8rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.5;
`;

const SystemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SystemCard = styled(motion.div)`
  background: rgba(26, 26, 46, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const SystemHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.2rem;
  
  .icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: 8px;
    background: ${props => props.color ? `rgba(${props.color}, 0.1)` : 'rgba(255, 255, 255, 0.05)'};
    margin-right: 1rem;
    
    .icon {
      color: ${props => props.color ? `rgb(${props.color})` : 'var(--primary)'};
    }
  }
  
  .title {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  margin-bottom: 1rem;
  overflow: hidden;
  
  .progress {
    height: 100%;
    background: ${props => props.color ? `rgb(${props.color})` : 'var(--primary)'};
    border-radius: 4px;
    width: ${props => props.value}%;
    box-shadow: 0 0 8px ${props => props.color ? `rgba(${props.color}, 0.5)` : 'rgba(0, 180, 216, 0.5)'};
  }
`;

const SystemInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .status {
    color: ${props => props.color ? `rgb(${props.color})` : 'var(--primary)'};
    font-weight: 600;
    font-size: 0.9rem;
  }
  
  .value {
    font-size: 1.8rem;
    font-weight: 700;
    font-family: 'Exo', sans-serif;
    color: var(--text-primary);
  }
`;

// Dashboard component
const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [threats, setThreats] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [chartTimeframe, setChartTimeframe] = useState('hour');
  const [expandedThreat, setExpandedThreat] = useState(null);
  
  // Mock data for fallback
  const mockData = {
    traffic_rate: 125,
    avg_response_time: 52,
    security_score: 87,
    traffic_history: Array.from({ length: 24 }, (_, i) => ({
      timestamp: `${i}:00`,
      value: Math.floor(Math.random() * 100) + 50
    })),
    threat_distribution: [
      { type: 'Intrusion', count: 12 },
      { type: 'DDoS', count: 5 },
      { type: 'Malware', count: 8 },
      { type: 'Phishing', count: 15 }
    ]
  };
  
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
  
  // Fetch data from API
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);
  
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [metricsRes, threatsRes, statusRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/metrics`),
        fetch(`${API_BASE_URL}/api/threats`),
        fetch(`${API_BASE_URL}/api/status`)
      ]);
      
      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        setMetrics(metricsData);
      } else {
        setMetrics(mockData);
      }
      
      if (threatsRes.ok) {
        const threatsData = await threatsRes.json();
        setThreats(threatsData);
      } else {
        setThreats([]);
      }
      
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setIsMonitoring(statusData.active);
      } else {
        setIsMonitoring(false);
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setMetrics(mockData);
      setThreats([]);
    }
    setIsLoading(false);
  };
  
  // Toggle monitoring
  const toggleMonitoring = async () => {
    try {
      const endpoint = isMonitoring ? '/api/stop_analysis' : '/api/start_analysis';
      
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          count: 100,
          duration: 0
        })
      });
      
      if (res.ok) {
        setIsMonitoring(!isMonitoring);
        fetchData();
      }
    } catch (error) {
      console.error('Error toggling monitoring:', error);
    }
  };
  
  // Format timestamp to readable format
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown';
    try {
      return new Date(timestamp).toLocaleString();
    } catch (error) {
      return timestamp;
    }
  };
  
  // Toggle expanded threat
  const toggleThreatExpand = (id) => {
    if (expandedThreat === id) {
      setExpandedThreat(null);
    } else {
      setExpandedThreat(id);
    }
  };
  
  return (
    <PageContainer>
      <PageHeader
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Network Security Dashboard</h1>
        <p>Real-time monitoring and analysis of network security metrics</p>
      </PageHeader>
      
      <ControlsBar
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <StatusDisplay>
          <StatusIndicator active={isMonitoring}>
            <div className="dot"></div>
            <span className="status">{isMonitoring ? 'Monitoring Active' : 'Monitoring Inactive'}</span>
          </StatusIndicator>
          
          {isMonitoring && (
            <div style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
              <Clock size={14} style={{ marginRight: '0.3rem', display: 'inline' }} />
              Updated: {new Date().toLocaleTimeString()}
            </div>
          )}
        </StatusDisplay>
        
        <ControlsGroup>
          <Button
            primary={!isMonitoring}
            onClick={toggleMonitoring}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {isMonitoring ? (
              <>
                <Pause size={16} /> Stop Monitoring
              </>
            ) : (
              <>
                <Play size={16} /> Start Monitoring
              </>
            )}
          </Button>
          
          <IconButton
            onClick={fetchData}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={isLoading}
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          </IconButton>
        </ControlsGroup>
      </ControlsBar>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <StatsGrid>
          <StatCard 
            variants={itemVariants}
            color="var(--primary)"
          >
            <StatHeader color="var(--primary)">
              <div>
                <div className="title">Network Traffic</div>
              </div>
              <div className="icon">
                <Activity size={20} />
              </div>
            </StatHeader>
            <StatValue>
              {isLoading ? '...' : metrics?.traffic_rate || '0'}
              <span className="unit">pkts/s</span>
            </StatValue>
            <StatTrend positive={true}>
              <span className="arrow">↑</span> 15% from last hour
            </StatTrend>
          </StatCard>
          
          <StatCard 
            variants={itemVariants}
            color="var(--danger)"
          >
            <StatHeader color="var(--danger)">
              <div>
                <div className="title">Active Threats</div>
              </div>
              <div className="icon">
                <AlertTriangle size={20} />
              </div>
            </StatHeader>
            <StatValue>
              {isLoading ? '...' : threats.length}
              <span className="unit">threats</span>
            </StatValue>
            <StatTrend positive={false}>
              <span className="arrow">↓</span> 2% from yesterday
            </StatTrend>
          </StatCard>
          
          <StatCard 
            variants={itemVariants}
            color="var(--success)"
          >
            <StatHeader color="var(--success)">
              <div>
                <div className="title">Response Time</div>
              </div>
              <div className="icon">
                <Radio size={20} />
              </div>
            </StatHeader>
            <StatValue>
              {isLoading ? '...' : metrics?.avg_response_time || '0'}
              <span className="unit">ms</span>
            </StatValue>
            <StatTrend positive={true}>
              <span className="arrow">↓</span> 5% vs baseline
            </StatTrend>
          </StatCard>
          
          <StatCard 
            variants={itemVariants}
            color="var(--secondary)"
          >
            <StatHeader color="var(--secondary)">
              <div>
                <div className="title">Security Score</div>
              </div>
              <div className="icon">
                <Shield size={20} />
              </div>
            </StatHeader>
            <StatValue>
              {isLoading ? '...' : metrics?.security_score || '0'}
              <span className="unit">%</span>
            </StatValue>
            <StatTrend positive={true}>
              <span className="arrow">↑</span> 3% since last scan
            </StatTrend>
          </StatCard>
        </StatsGrid>
        
        <ChartsGrid>
          <ChartCard
            variants={itemVariants}
          >
            <ChartHeader color="var(--primary)">
              <h3>
                <BarChart2 size={18} /> Network Traffic Analysis
              </h3>
              <ChartControls>
                {['hour', 'day', 'week'].map(period => (
                  <ChartControlButton
                    key={period}
                    active={chartTimeframe === period}
                    onClick={() => setChartTimeframe(period)}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </ChartControlButton>
                ))}
              </ChartControls>
            </ChartHeader>
            <ChartBody>
              {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <RefreshCw size={30} className="animate-spin" style={{ color: 'var(--primary)' }} />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metrics?.traffic_history || mockData.traffic_history}>
                    <defs>
                      <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="timestamp" 
                      stroke="var(--text-tertiary)"
                      tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="var(--text-tertiary)"
                      tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--surface)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'var(--text-primary)'
                      }}
                      itemStyle={{ color: 'var(--text-primary)' }}
                      labelStyle={{ color: 'var(--text-secondary)' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="var(--primary)" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorTraffic)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </ChartBody>
          </ChartCard>
          
          <ChartCard
            variants={itemVariants}
          >
            <ChartHeader color="var(--secondary)">
              <h3>
                <Shield size={18} /> Threat Distribution
              </h3>
            </ChartHeader>
            <ChartBody>
              {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <RefreshCw size={30} className="animate-spin" style={{ color: 'var(--secondary)' }} />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics?.threat_distribution || mockData.threat_distribution}>
                    <XAxis 
                      dataKey="type" 
                      stroke="var(--text-tertiary)"
                      tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="var(--text-tertiary)"
                      tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--surface)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'var(--text-primary)'
                      }}
                      itemStyle={{ color: 'var(--text-primary)' }}
                      labelStyle={{ color: 'var(--text-secondary)' }}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="var(--secondary)" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartBody>
          </ChartCard>
        </ChartsGrid>
        
        <ThreatsFeed
          variants={itemVariants}
        >
          <ThreatsHeader>
            <h3>
              <AlertTriangle size={18} /> Live Threat Feed
            </h3>
            <IconButton
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => fetchData()}
            >
              <RefreshCw size={16} />
            </IconButton>
          </ThreatsHeader>
          <ThreatsBody>
            {isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                <RefreshCw size={30} className="animate-spin" style={{ color: 'var(--danger)' }} />
              </div>
            ) : threats.length > 0 ? (
              threats.map((threat, index) => (
                <ThreatAlert
                  key={index}
                  severity={threat.severity}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => toggleThreatExpand(index)}
                >
                  <ThreatHeader severity={threat.severity}>
                    <div className="title">
                      <AlertTriangle size={18} className="icon" />
                      {threat.type}
                    </div>
                    <div className="severity">
                      {threat.severity}
                    </div>
                  </ThreatHeader>
                  <ThreatInfo expanded={expandedThreat === index}>
                    <div className="info-item">
                      <span className="label">Source:</span>
                      <span className="value" style={{fontFamily: 'monospace'}}>{threat.source_ip}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Time:</span>
                      <span className="value">{formatTimestamp(threat.timestamp)}</span>
                    </div>
                  </ThreatInfo>
                  {expandedThreat === index && threat.details && (
                    <ThreatDetails>
                      {threat.details}
                    </ThreatDetails>
                  )}
                </ThreatAlert>
              ))
            ) : (
              <EmptyState>
                <Lock size={50} className="icon" />
                <h4>No active threats detected</h4>
                <p>Your network is currently secure. Continuous monitoring is active to detect any potential threats.</p>
              </EmptyState>
            )}
          </ThreatsBody>
        </ThreatsFeed>
        
        <SystemGrid>
          <SystemCard
            variants={itemVariants}
          >
            <SystemHeader color="6, 214, 160">
              <div className="icon-container" color="6, 214, 160">
                <Cpu size={22} className="icon" />
              </div>
              <div className="title">CPU Usage</div>
            </SystemHeader>
            <ProgressBar value={25} color="6, 214, 160">
              <div className="progress"></div>
            </ProgressBar>
            <SystemInfo color="6, 214, 160">
              <div className="status">Healthy</div>
              <div className="value">25%</div>
            </SystemInfo>
          </SystemCard>
          
          <SystemCard
            variants={itemVariants}
          >
            <SystemHeader color="0, 119, 182">
              <div className="icon-container" color="0, 119, 182">
                <Database size={22} className="icon" />
              </div>
              <div className="title">Memory Usage</div>
            </SystemHeader>
            <ProgressBar value={45} color="0, 119, 182">
              <div className="progress"></div>
            </ProgressBar>
            <SystemInfo color="0, 119, 182">
              <div className="status">Normal</div>
              <div className="value">45%</div>
            </SystemInfo>
          </SystemCard>
          
          <SystemCard
            variants={itemVariants}
          >
            <SystemHeader color="114, 9, 183">
              <div className="icon-container" color="114, 9, 183">
                <Server size={22} className="icon" />
              </div>
              <div className="title">Disk I/O</div>
            </SystemHeader>
            <ProgressBar value={12} color="114, 9, 183">
              <div className="progress"></div>
            </ProgressBar>
            <SystemInfo color="114, 9, 183">
              <div className="status">Healthy</div>
              <div className="value">12%</div>
            </SystemInfo>
          </SystemCard>
        </SystemGrid>
      </motion.div>
    </PageContainer>
  );
};

export default Dashboard;
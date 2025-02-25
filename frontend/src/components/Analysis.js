import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { LineChart, BarChart, XAxis, YAxis, Tooltip, Legend, Line, Bar, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Activity, Clock, TrendingUp, BarChart2, Filter, ArrowUpRight, ArrowDownRight, RefreshCw, Calendar, ZoomIn, ZoomOut } from "lucide-react";
import { API_BASE_URL } from "../app";

// Styled components
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

const TimeframeSelector = styled.div`
  display: flex;
  background: rgba(10, 10, 27, 0.5);
  border-radius: 8px;
  padding: 0.3rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const TimeframeButton = styled.button`
  background: ${props => props.active ? 'linear-gradient(45deg, var(--primary-dark), var(--primary))' : 'transparent'};
  color: ${props => props.active ? '#fff' : 'var(--text-secondary)'};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: ${props => props.active ? '#fff' : 'var(--primary-light)'};
  }
`;

const ControlActions = styled.div`
  display: flex;
  gap: 0.75rem;
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
  font-size: 1.5rem;
  font-weight: 700;
  font-family: 'Exo', sans-serif;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
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

const GridRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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
  display: flex;
  flex-direction: column;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
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

const ChartBody = styled.div`
  padding: 1.5rem;
  flex: 1;
  min-height: 320px;
`;

const LegendItem = styled.div`
  display: inline-flex;
  align-items: center;
  margin-right: 1rem;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);

  .indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 0.5rem;
    background: ${props => props.color || 'var(--primary)'};
    box-shadow: 0 0 4px ${props => props.color || 'var(--primary)'};
  }
`;

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

// Mock data for development
const generateMockData = (timeframe) => {
  const points = timeframe === '24h' ? 24 : timeframe === '7d' ? 7 : 30;
  const trafficData = Array.from({ length: points }, (_, i) => ({
    timestamp: timeframe === '24h' ? `${i}:00` : timeframe === '7d' ? `Day ${i+1}` : `Day ${i+1}`,
    requests: Math.floor(Math.random() * 4000) + 2000,
    unique_visitors: Math.floor(Math.random() * 1500) + 1000
  }));
  
  const responseTimeData = Array.from({ length: points }, (_, i) => ({
    timestamp: timeframe === '24h' ? `${i}:00` : timeframe === '7d' ? `Day ${i+1}` : `Day ${i+1}`,
    avg_response_time: Math.floor(Math.random() * 80) + 80,
    p95_response_time: Math.floor(Math.random() * 150) + 150
  }));
  
  const statusCodeData = [
    { status_code: '200', count: Math.floor(Math.random() * 8000) + 8000 },
    { status_code: '201', count: Math.floor(Math.random() * 1000) + 1000 },
    { status_code: '301', count: Math.floor(Math.random() * 800) + 800 },
    { status_code: '304', count: Math.floor(Math.random() * 3000) + 3000 },
    { status_code: '400', count: Math.floor(Math.random() * 500) + 100 },
    { status_code: '401', count: Math.floor(Math.random() * 300) + 50 },
    { status_code: '403', count: Math.floor(Math.random() * 200) + 20 },
    { status_code: '404', count: Math.floor(Math.random() * 1000) + 500 },
    { status_code: '500', count: Math.floor(Math.random() * 300) + 10 }
  ];
  
  const anomalyData = Array.from({ length: points }, (_, i) => ({
    timestamp: timeframe === '24h' ? `${i}:00` : timeframe === '7d' ? `Day ${i+1}` : `Day ${i+1}`,
    anomaly_score: Math.random() * 0.7 + 0.1,
    threshold: 0.7
  }));
  
  // Add some spike for visual interest
  const spikeIndex = Math.floor(Math.random() * points);
  anomalyData[spikeIndex].anomaly_score = 0.9;
  
  return { trafficData, responseTimeData, statusCodeData, anomalyData };
};

const Analysis = () => {
  const [trafficData, setTrafficData] = useState([]);
  const [responseTimeData, setResponseTimeData] = useState([]);
  const [statusCodeData, setStatusCodeData] = useState([]);
  const [anomalyData, setAnomalyData] = useState([]);
  const [timeFrame, setTimeFrame] = useState('24h');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, uncomment this to fetch from actual API
        /*
        const [trafficRes, responseTimeRes, statusCodeRes, anomalyRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/analytics/traffic?timeframe=${timeFrame}`),
          fetch(`${API_BASE_URL}/api/analytics/response-time?timeframe=${timeFrame}`),
          fetch(`${API_BASE_URL}/api/analytics/status-codes?timeframe=${timeFrame}`),
          fetch(`${API_BASE_URL}/api/analytics/anomalies?timeframe=${timeFrame}`)
        ]);
        
        setTrafficData(await trafficRes.json());
        setResponseTimeData(await responseTimeRes.json());
        setStatusCodeData(await statusCodeRes.json());
        setAnomalyData(await anomalyRes.json());
        */
        
        // For development, use mock data
        const mockData = generateMockData(timeFrame);
        setTrafficData(mockData.trafficData);
        setResponseTimeData(mockData.responseTimeData);
        setStatusCodeData(mockData.statusCodeData);
        setAnomalyData(mockData.anomalyData);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeFrame]);

  const refreshData = () => {
    const mockData = generateMockData(timeFrame);
    setTrafficData(mockData.trafficData);
    setResponseTimeData(mockData.responseTimeData);
    setStatusCodeData(mockData.statusCodeData);
    setAnomalyData(mockData.anomalyData);
  };

  return (
    <PageContainer>
      <PageHeader
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Traffic Analysis</h1>
        <p>Detailed metrics and pattern analysis for network traffic</p>
      </PageHeader>
      
      <ControlsBar
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <TimeframeSelector>
          <TimeframeButton 
            active={timeFrame === '24h'} 
            onClick={() => setTimeFrame('24h')}
          >
            24h
          </TimeframeButton>
          <TimeframeButton 
            active={timeFrame === '7d'} 
            onClick={() => setTimeFrame('7d')}
          >
            7d
          </TimeframeButton>
          <TimeframeButton 
            active={timeFrame === '30d'} 
            onClick={() => setTimeFrame('30d')}
          >
            30d
          </TimeframeButton>
        </TimeframeSelector>
        
        <ControlActions>
          <IconButton
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Refresh data"
            onClick={refreshData}
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </IconButton>
          <IconButton
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Calendar view"
          >
            <Calendar size={16} />
          </IconButton>
          <IconButton
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Zoom in"
          >
            <ZoomIn size={16} />
          </IconButton>
          <IconButton
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Zoom out"
          >
            <ZoomOut size={16} />
          </IconButton>
        </ControlActions>
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
                <div className="title">Avg Traffic Rate</div>
              </div>
              <div className="icon">
                <Activity size={20} />
              </div>
            </StatHeader>
            <StatValue>3,245 req/min</StatValue>
            <StatTrend positive={true}>
              <ArrowUpRight size={14} className="arrow" /> 12.5% from previous period
            </StatTrend>
          </StatCard>
          
          <StatCard 
            variants={itemVariants}
            color="var(--success)"
          >
            <StatHeader color="var(--success)">
              <div>
                <div className="title">Avg Response Time</div>
              </div>
              <div className="icon">
                <Clock size={20} />
              </div>
            </StatHeader>
            <StatValue>121 ms</StatValue>
            <StatTrend positive={false}>
              <ArrowDownRight size={14} className="arrow" /> 5.2% from previous period
            </StatTrend>
          </StatCard>
          
          <StatCard 
            variants={itemVariants}
            color="var(--secondary)"
          >
            <StatHeader color="var(--secondary)">
              <div>
                <div className="title">Peak Hours Traffic</div>
              </div>
              <div className="icon">
                <TrendingUp size={20} />
              </div>
            </StatHeader>
            <StatValue>5,721 req/min</StatValue>
            <StatTrend positive={true}>
              <ArrowUpRight size={14} className="arrow" /> 8.7% from previous period
            </StatTrend>
          </StatCard>
          
          <StatCard 
            variants={itemVariants}
            color="var(--warning)"
          >
            <StatHeader color="var(--warning)">
              <div>
                <div className="title">Unique IPs</div>
              </div>
              <div className="icon">
                <BarChart2 size={20} />
              </div>
            </StatHeader>
            <StatValue>2,891</StatValue>
            <StatTrend positive={true}>
              <ArrowUpRight size={14} className="arrow" /> 23.4% from previous period
            </StatTrend>
          </StatCard>
        </StatsGrid>
        
        <GridRow>
          <ChartCard
            variants={itemVariants}
          >
            <ChartHeader color="var(--primary)">
              <h3>Traffic Trend Analysis</h3>
              <ChartControls>
                <IconButton
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <RefreshCw size={14} />
                </IconButton>
              </ChartControls>
            </ChartHeader>
            <ChartBody>
              {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <RefreshCw size={30} className="animate-spin" style={{ color: 'var(--primary)' }} />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trafficData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                    <XAxis dataKey="timestamp" stroke="var(--text-tertiary)" />
                    <YAxis stroke="var(--text-tertiary)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--surface)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'var(--text-primary)'
                      }}
                      itemStyle={{ color: 'var(--text-primary)' }}
                      labelStyle={{ color: 'var(--text-secondary)' }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="requests" 
                      stroke="var(--primary)" 
                      strokeWidth={2} 
                      dot={false}
                      activeDot={{ r: 6, stroke: 'var(--primary)', strokeWidth: 2, fill: 'var(--surface)' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="unique_visitors" 
                      stroke="var(--secondary)" 
                      strokeWidth={2} 
                      dot={false}
                      activeDot={{ r: 6, stroke: 'var(--secondary)', strokeWidth: 2, fill: 'var(--surface)' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </ChartBody>
          </ChartCard>
          
          <ChartCard
            variants={itemVariants}
          >
            <ChartHeader color="var(--success)">
              <h3>Response Time Distribution</h3>
              <ChartControls>
                <IconButton
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <RefreshCw size={14} />
                </IconButton>
              </ChartControls>
            </ChartHeader>
            <ChartBody>
              {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <RefreshCw size={30} className="animate-spin" style={{ color: 'var(--success)' }} />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={responseTimeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                    <XAxis dataKey="timestamp" stroke="var(--text-tertiary)" />
                    <YAxis stroke="var(--text-tertiary)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--surface)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'var(--text-primary)'
                      }}
                      itemStyle={{ color: 'var(--text-primary)' }}
                      labelStyle={{ color: 'var(--text-secondary)' }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="avg_response_time" 
                      stroke="var(--success)" 
                      strokeWidth={2} 
                      dot={false}
                      activeDot={{ r: 6, stroke: 'var(--success)', strokeWidth: 2, fill: 'var(--surface)' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="p95_response_time" 
                      stroke="var(--warning)" 
                      strokeWidth={2} 
                      dot={false}
                      activeDot={{ r: 6, stroke: 'var(--warning)', strokeWidth: 2, fill: 'var(--surface)' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </ChartBody>
          </ChartCard>
        </GridRow>
        
        <GridRow>
          <ChartCard
            variants={itemVariants}
          >
            <ChartHeader color="var(--secondary)">
              <h3>HTTP Status Code Distribution</h3>
              <ChartControls>
                <IconButton
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <RefreshCw size={14} />
                </IconButton>
              </ChartControls>
            </ChartHeader>
            <ChartBody>
              {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <RefreshCw size={30} className="animate-spin" style={{ color: 'var(--secondary)' }} />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statusCodeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                    <XAxis dataKey="status_code" stroke="var(--text-tertiary)" />
                    <YAxis stroke="var(--text-tertiary)" />
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
          
          <ChartCard
            variants={itemVariants}
          >
            <ChartHeader color="var(--danger)">
              <h3>Anomaly Detection Timeline</h3>
              <ChartControls>
                <IconButton
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Filter size={14} />
                </IconButton>
              </ChartControls>
            </ChartHeader>
            <ChartBody>
              <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <LegendItem color="var(--danger)">
                  <div className="indicator"></div>
                  <span>Critical</span>
                </LegendItem>
                <LegendItem color="var(--warning)">
                  <div className="indicator"></div>
                  <span>Warning</span>
                </LegendItem>
                <LegendItem color="var(--primary)">
                  <div className="indicator"></div>
                  <span>Info</span>
                </LegendItem>
              </div>
              
              {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <RefreshCw size={30} className="animate-spin" style={{ color: 'var(--danger)' }} />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={anomalyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                    <XAxis dataKey="timestamp" stroke="var(--text-tertiary)" />
                    <YAxis stroke="var(--text-tertiary)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--surface)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'var(--text-primary)'
                      }}
                      itemStyle={{ color: 'var(--text-primary)' }}
                      labelStyle={{ color: 'var(--text-secondary)' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="anomaly_score" 
                      stroke="var(--danger)" 
                      strokeWidth={2} 
                      dot={true}
                      activeDot={{ r: 6, stroke: 'var(--danger)', strokeWidth: 2, fill: 'var(--surface)' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="threshold" 
                      stroke="var(--secondary-light)" 
                      strokeWidth={1} 
                      dot={false}
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </ChartBody>
          </ChartCard>
        </GridRow>
      </motion.div>
    </PageContainer>
  );
};

export default Analysis;
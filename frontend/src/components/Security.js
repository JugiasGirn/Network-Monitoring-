import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { LineChart, BarChart, XAxis, YAxis, Tooltip, Legend, Line, Bar, CartesianGrid, ResponsiveContainer } from 'recharts';
import { BarChart2, Clock, Activity, TrendingUp, Filter, ArrowUpRight, ArrowDownRight, RefreshCw, Download, ChevronDown } from 'lucide-react';
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
  background: ${props => props.active ? 'rgba(0, 180, 216, 0.2)' : 'transparent'};
  color: ${props => props.active ? 'var(--primary)' : 'var(--text-tertiary)'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Exo', sans-serif;
  
  &:hover {
    color: ${props => props.active ? 'var(--primary)' : 'var(--text-secondary)'};
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

const ChartsGrid = styled.div`
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

const LegendContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  color: var(--text-tertiary);

  &:not(:last-child) {
    margin-right: 1rem;
  }

  .indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 0.5rem;
    background: ${props => props.color};
    box-shadow: 0 0 5px ${props => props.color};
  }
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-tertiary);
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-secondary);
  }
`;

// Generate sample data for testing
const generateMockData = (timeframe) => {
  // Traffic data
  const trafficData = [];
  const pointCount = timeframe === '24h' ? 24 : timeframe === '7d' ? 7 : 30;
  
  for (let i = 0; i < pointCount; i++) {
    const timestamp = timeframe === '24h' 
      ? `${i}:00` 
      : timeframe === '7d' 
        ? `Day ${i+1}`
        : `Day ${i+1}`;
    
    trafficData.push({
      timestamp,
      requests: Math.floor(Math.random() * 2000) + 2000,
      unique_visitors: Math.floor(Math.random() * 1000) + 1000
    });
  }
  
  // Response time data
  const responseTimeData = trafficData.map(item => ({
    timestamp: item.timestamp,
    avg_response_time: Math.floor(Math.random() * 50) + 80,
    p95_response_time: Math.floor(Math.random() * 100) + 150
  }));
  
  // Status code data
  const statusCodeData = [
    { status_code: '200', count: Math.floor(Math.random() * 10000) + 20000 },
    { status_code: '301', count: Math.floor(Math.random() * 1000) + 2000 },
    { status_code: '404', count: Math.floor(Math.random() * 500) + 500 },
    { status_code: '500', count: Math.floor(Math.random() * 200) + 100 },
    { status_code: '403', count: Math.floor(Math.random() * 300) + 200 }
  ];
  
  // Anomaly data
  const anomalyData = [];
  for (let i = 0; i < pointCount; i++) {
    anomalyData.push({
      timestamp: trafficData[i].timestamp,
      anomaly_score: Math.floor(Math.random() * 100),
      threshold: 70
    });
  }
  
  return { trafficData, responseTimeData, statusCodeData, anomalyData };
};

// Main component
const Analysis = () => {
  const [trafficData, setTrafficData] = useState([]);
  const [responseTimeData, setResponseTimeData] = useState([]);
  const [statusCodeData, setStatusCodeData] = useState([]);
  const [anomalyData, setAnomalyData] = useState([]);
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
  
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      try {
        // Try to fetch real data from API
        const [trafficRes, responseTimeRes, statusCodeRes, anomalyRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/analytics/traffic?timeframe=${timeFrame}`),
          fetch(`${API_BASE_URL}/api/analytics/response-time?timeframe=${timeFrame}`),
          fetch(`${API_BASE_URL}/api/analytics/status-codes?timeframe=${timeFrame}`),
          fetch(`${API_BASE_URL}/api/analytics/anomalies?timeframe=${timeFrame}`)
        ]);
        
        if (trafficRes.ok && responseTimeRes.ok && statusCodeRes.ok && anomalyRes.ok) {
          setTrafficData(await trafficRes.json());
          setResponseTimeData(await responseTimeRes.json());
          setStatusCodeData(await statusCodeRes.json());
          setAnomalyData(await anomalyRes.json());
        } else {
          // If API calls fail, use mock data
          const mockData = generateMockData(timeFrame);
          setTrafficData(mockData.trafficData);
          setResponseTimeData(mockData.responseTimeData);
          setStatusCodeData(mockData.statusCodeData);
          setAnomalyData(mockData.anomalyData);
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        // Use mock data as fallback
        const mockData = generateMockData(timeFrame);
        setTrafficData(mockData.trafficData);
        setResponseTimeData(mockData.responseTimeData);
        setStatusCodeData(mockData.statusCodeData);
        setAnomalyData(mockData.anomalyData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeFrame]);
  
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
  
  return (
    <PageContainer>
      <PageHeader
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <HeaderContent>
          <h1>Traffic Analysis</h1>
          <p>Detailed metrics and pattern analysis</p>
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
        {/* Stats Row */}
        <StatsGrid>
          <StatCard 
            variants={itemVariants}
            color="var(--primary)"
          >
            <StatHeader color="var(--primary)">
              <div>
                <div className="title">Avg Traffic Rate</div>
                <div className="value">3,245 req/min</div>
              </div>
              <div className="icon-container">
                <Activity size={24} />
              </div>
            </StatHeader>
            <StatTrend positive={true}>
              <ArrowUpRight size={16} /> 12.5% from previous period
            </StatTrend>
          </StatCard>
          
          <StatCard 
            variants={itemVariants}
            color="var(--success)"
          >
            <StatHeader color="var(--success)">
              <div>
                <div className="title">Avg Response Time</div>
                <div className="value">121 ms</div>
              </div>
              <div className="icon-container">
                <Clock size={24} />
              </div>
            </StatHeader>
            <StatTrend positive={false}>
              <ArrowDownRight size={16} /> 5.2% from previous period
            </StatTrend>
          </StatCard>
          
          <StatCard 
            variants={itemVariants}
            color="var(--secondary)"
          >
            <StatHeader color="var(--secondary)">
              <div>
                <div className="title">Peak Hours Traffic</div>
                <div className="value">5,721 req/min</div>
              </div>
              <div className="icon-container">
                <TrendingUp size={24} />
              </div>
            </StatHeader>
            <StatTrend positive={true}>
              <ArrowUpRight size={16} /> 8.7% from previous period
            </StatTrend>
          </StatCard>
          
          <StatCard 
            variants={itemVariants}
            color="var(--warning)"
          >
            <StatHeader color="var(--warning)">
              <div>
                <div className="title">Unique IPs</div>
                <div className="value">2,891</div>
              </div>
              <div className="icon-container">
                <BarChart2 size={24} />
              </div>
            </StatHeader>
            <StatTrend positive={true}>
              <ArrowUpRight size={16} /> 23.4% from previous period
            </StatTrend>
          </StatCard>
        </StatsGrid>
        
        {/* Top Charts Grid */}
        <ChartsGrid>
          <ChartCard variants={itemVariants}>
            <ChartHeader color="var(--primary)">
              <h3>Traffic Trend Analysis</h3>
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
                  <LineChart data={trafficData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                    <XAxis dataKey="timestamp" stroke="var(--text-tertiary)" />
                    <YAxis stroke="var(--text-tertiary)" />
                    <Tooltip {...tooltipStyle} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="requests" 
                      stroke="var(--primary)" 
                      strokeWidth={2} 
                      dot={{ fill: 'var(--primary)', r: 4, strokeWidth: 0 }}
                      activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--primary)', stroke: 'white' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="unique_visitors" 
                      stroke="var(--secondary)" 
                      strokeWidth={2} 
                      dot={{ fill: 'var(--secondary)', r: 4, strokeWidth: 0 }}
                      activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--secondary)', stroke: 'white' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </ChartContent>
          </ChartCard>
          
          <ChartCard variants={itemVariants}>
            <ChartHeader color="var(--success)">
              <h3>Response Time Distribution</h3>
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
                  <RefreshCw size={30} className="animate-spin" style={{ color: 'var(--success)' }} />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={responseTimeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                    <XAxis dataKey="timestamp" stroke="var(--text-tertiary)" />
                    <YAxis stroke="var(--text-tertiary)" />
                    <Tooltip {...tooltipStyle} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="avg_response_time" 
                      stroke="var(--success)" 
                      strokeWidth={2} 
                      dot={{ fill: 'var(--success)', r: 4, strokeWidth: 0 }}
                      activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--success)', stroke: 'white' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="p95_response_time" 
                      stroke="var(--warning)" 
                      strokeWidth={2} 
                      dot={{ fill: 'var(--warning)', r: 4, strokeWidth: 0 }}
                      activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--warning)', stroke: 'white' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </ChartContent>
          </ChartCard>
        </ChartsGrid>
        
        {/* Bottom Charts Grid */}
        <ChartsGrid>
          <ChartCard variants={itemVariants}>
            <ChartHeader color="var(--secondary)">
              <h3>HTTP Status Code Distribution</h3>
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
                  <RefreshCw size={30} className="animate-spin" style={{ color: 'var(--secondary)' }} />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statusCodeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                    <XAxis dataKey="status_code" stroke="var(--text-tertiary)" />
                    <YAxis stroke="var(--text-tertiary)" />
                    <Tooltip {...tooltipStyle} />
                    <Bar 
                      dataKey="count" 
                      fill="var(--secondary)" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartContent>
          </ChartCard>
          
          <ChartCard variants={itemVariants}>
            <ChartHeader color="var(--danger)">
              <h3>Anomaly Detection Timeline</h3>
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
              <LegendContainer>
                <div style={{ display: 'flex' }}>
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
                
                <DropdownButton>
                  <Filter size={14} />
                  <span>Filter</span>
                  <ChevronDown size={14} />
                </DropdownButton>
              </LegendContainer>
              
              {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '250px' }}>
                  <RefreshCw size={30} className="animate-spin" style={{ color: 'var(--danger)' }} />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={anomalyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                    <XAxis dataKey="timestamp" stroke="var(--text-tertiary)" />
                    <YAxis stroke="var(--text-tertiary)" />
                    <Tooltip {...tooltipStyle} />
                    <Line 
                      type="monotone" 
                      dataKey="anomaly_score" 
                      stroke="var(--danger)" 
                      strokeWidth={2} 
                      dot={{ fill: 'var(--danger)', r: 4, strokeWidth: 0 }}
                      activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--danger)', stroke: 'white' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="threshold" 
                      stroke="var(--secondary-light)" 
                      strokeWidth={1} 
                      strokeDasharray="5 5" 
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </ChartContent>
          </ChartCard>
        </ChartsGrid>
      </motion.div>
    </PageContainer>
  );
};

export default Security;
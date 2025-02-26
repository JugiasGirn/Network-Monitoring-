import React, { useState, useEffect, createContext, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Analysis from './components/Analysis';
import Security from './components/Security';
import { Shield, AlertTriangle, Server } from 'lucide-react';

// API Base URL for all requests
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

// Create API context for global access to API functions
export const ApiContext = createContext();

// Main app container with flex layout
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--background);
  color: var(--text-primary);
  position: relative;
  overflow-x: hidden;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 5% 15%, rgba(0, 180, 216, 0.08) 0%, transparent 25%),
      radial-gradient(circle at 95% 85%, rgba(114, 9, 183, 0.08) 0%, transparent 25%);
    pointer-events: none;
    z-index: 0;
  }
`;

// Main content with appropriate spacing for navbar
const MainContent = styled.main`
  flex: 1;
  margin-top: 70px; /* Same as navbar height */
  position: relative;
  z-index: 1;
`;

// Background grid lines effect
const GridLines = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.05;
  background-size: 50px 50px;
  background-image: 
    linear-gradient(to right, var(--primary) 1px, transparent 1px),
    linear-gradient(to bottom, var(--primary) 1px, transparent 1px);
`;

// API Status Banner
const ApiBanner = styled(motion.div)`
  width: 100%;
  padding: 0.75rem;
  background: rgba(230, 57, 70, 0.2);
  backdrop-filter: blur(8px);
  color: var(--text-primary);
  text-align: center;
  font-size: 0.9rem;
  border-bottom: 1px solid rgba(230, 57, 70, 0.3);
  margin-top: 70px; /* Same as navbar height */
  
  button {
    background: none;
    border: none;
    color: var(--primary);
    margin-left: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s;
    text-decoration: underline;
    
    &:hover {
      color: var(--primary-light);
    }
  }
`;

// Error Container for Error Boundary
const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: var(--background);
  color: var(--text-primary);
  text-align: center;
  
  svg {
    filter: drop-shadow(0 0 10px var(--danger));
    margin-bottom: 1.5rem;
  }
  
  h1 {
    font-family: 'Exo', sans-serif;
    font-size: 2rem;
    margin-bottom: 1rem;
    color: var(--danger);
  }
  
  p {
    color: var(--text-secondary);
    max-width: 500px;
    margin-bottom: 2rem;
    line-height: 1.6;
  }
  
  button {
    background: linear-gradient(45deg, var(--primary-dark), var(--primary));
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    color: white;
    font-family: 'Exo', sans-serif;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(0, 180, 216, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(0, 180, 216, 0.4);
    }
  }
  
  .error-details {
    margin-top: 2rem;
    padding: 1rem;
    background: rgba(10, 10, 27, 0.5);
    border: 1px solid rgba(230, 57, 70, 0.3);
    border-radius: 0.5rem;
    max-width: 600px;
    overflow: auto;
    text-align: left;
    
    pre {
      color: var(--danger);
      font-family: monospace;
      font-size: 0.9rem;
      white-space: pre-wrap;
    }
  }
`;

// Loading Container
const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--background);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(0, 180, 216, 0.2) 0%, transparent 70%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.8;
    animation: pulse 3s infinite;
  }
  
  @keyframes pulse {
    0% { opacity: 0.5; transform: translate(-50%, -50%) scale(0.8); }
    50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.2); }
    100% { opacity: 0.5; transform: translate(-50%, -50%) scale(0.8); }
  }
`;

const LogoContainer = styled.div`
  width: 100px;
  height: 100px;
  background: rgba(0, 180, 216, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  margin-bottom: 1.5rem;
  
  svg {
    filter: drop-shadow(0 0 10px var(--primary));
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    border-radius: 50%;
    border: 2px solid rgba(0, 180, 216, 0.3);
    animation: spin 10s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  font-family: 'Exo', sans-serif;
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 1;
  letter-spacing: 1px;
  text-shadow: 0 0 10px var(--primary);
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid rgba(0, 180, 216, 0.1);
  border-top: 3px solid var(--primary);
  border-radius: 50%;
  animation: spin-fast 1s linear infinite;
  margin-top: 1.5rem;
  position: relative;
  z-index: 1;
  
  @keyframes spin-fast {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <AlertTriangle size={60} color="var(--danger)" />
          <h1>Something went wrong</h1>
          <p>
            An error occurred in the application. You can try refreshing the page or contact support if the issue persists.
          </p>
          <motion.button 
            onClick={() => window.location.reload()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Refresh Page
          </motion.button>
          
          {this.state.error && (
            <div className="error-details">
              <pre>{this.state.error.toString()}</pre>
            </div>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

// Loading Component
const LoadingScreen = () => (
  <LoadingContainer>
    <LogoContainer>
      <Shield size={40} color="var(--primary)" />
    </LogoContainer>
    <LoadingText>NetSecMon</LoadingText>
    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
      Network Security Monitor
    </div>
    <LoadingSpinner />
  </LoadingContainer>
);

// NotFound Component
const NotFound = () => (
  <ErrorContainer>
    <Server size={60} color="var(--primary)" />
    <h1 style={{ color: 'var(--primary)' }}>Page Not Found</h1>
    <p>The page you're looking for doesn't exist or has been moved.</p>
    <motion.button 
      onClick={() => window.history.back()}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Go Back
    </motion.button>
  </ErrorContainer>
);

// Main App Component
const App = () => {
  const [isReady, setIsReady] = useState(false);
  const [apiHealth, setApiHealth] = useState({ status: 'unknown', message: null });
  const [checkingApi, setCheckingApi] = useState(false);

  // API helper functions
  const apiHelpers = {
    // Function to perform GET requests
    get: async (endpoint) => {
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error(`GET Error for ${endpoint}:`, error);
        throw error;
      }
    },
    
    // Function to perform POST requests
    post: async (endpoint, data) => {
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error(`POST Error for ${endpoint}:`, error);
        throw error;
      }
    },
    
    // Health check to see if API is available
    checkHealth: async () => {
      if (checkingApi) return false;
      
      setCheckingApi(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/health`, { 
          method: 'GET',
          // Add a timeout to avoid waiting too long
          signal: AbortSignal.timeout(5000)
        });
        
        if (response.ok) {
          const data = await response.json();
          setApiHealth({ status: 'healthy', message: data.status });
          setCheckingApi(false);
          return true;
        } else {
          setApiHealth({ status: 'unhealthy', message: `HTTP ${response.status}` });
          setCheckingApi(false);
          return false;
        }
      } catch (error) {
        setApiHealth({ 
          status: 'unavailable', 
          message: error.name === 'AbortError' ? 'Connection timed out' : error.message
        });
        setCheckingApi(false);
        return false;
      }
    }
  };

  useEffect(() => {
    // Check API health when app loads
    apiHelpers.checkHealth();
    
    // Set up interval to check API health periodically
    const healthCheckInterval = setInterval(() => {
      apiHelpers.checkHealth();
    }, 30000); // Check every 30 seconds
    
    // Simulate app initialization (you could load initial required data here)
    const initTimer = setTimeout(() => {
      setIsReady(true);
    }, 1500); // Show loading screen for at least 1.5 seconds
    
    return () => {
      clearTimeout(initTimer);
      clearInterval(healthCheckInterval);
    };
  }, []);

  if (!isReady) {
    return <LoadingScreen />;
  }

  return (
    <ApiContext.Provider value={apiHelpers}>
      <ErrorBoundary>
        <Router>
          <AppContainer>
            <GridLines />
            <Navbar />
            
            {/* API Status banner - only show when API is not healthy */}
            {apiHealth.status !== 'healthy' && apiHealth.status !== 'unknown' && (
              <ApiBanner
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AlertTriangle 
                  size={16} 
                  style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }} 
                  color="var(--danger)" 
                />
                API connection issue: {apiHealth.message || 'Failed to fetch'}. 
                Some features may be unavailable.
                <button onClick={apiHelpers.checkHealth} disabled={checkingApi}>
                  {checkingApi ? 'Trying...' : 'Retry connection'}
                </button>
              </ApiBanner>
            )}
            
            <MainContent>
              <Suspense fallback={<LoadingScreen />}>
                <Routes>
                  <Route path="/" element={<Navigate to="/Dashboard" replace />} />
                  <Route path="/Dashboard" element={<Dashboard />} />
                  <Route path="/Analysis" element={<Analysis />} />
                  <Route path="/Security" element={<Security />} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </MainContent>
          </AppContainer>
        </Router>
      </ErrorBoundary>
    </ApiContext.Provider>
  );
};

export default App;

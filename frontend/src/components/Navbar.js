import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Activity, BarChart2, Settings, Bell, Menu, X, User, LogOut, Search } from "lucide-react";
import { API_BASE_URL } from "../app";
// Styled components
const NavContainer = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  backdrop-filter: blur(10px);
  background: rgba(10, 10, 27, 0.7);
  box-shadow: 0 0 20px rgba(0, 180, 216, 0.3);
  z-index: 1000;
  padding: 0 1.5rem;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled(Link)`
  font-family: 'Exo', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: #fff;
  display: flex;
  align-items: center;
  text-shadow: 0 0 10px var(--primary);
  
  svg {
    margin-right: 0.5rem;
    filter: drop-shadow(0 0 5px var(--primary));
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  position: relative;
  color: var(--text-secondary);
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  font-family: 'Exo', sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: color 0.3s;
  
  &:hover {
    color: var(--primary);
  }
  
  &::after {
    content: '';
    position: absolute;
    width: ${props => props.active ? '100%' : '0'};
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: var(--primary);
    transition: width 0.3s ease;
    box-shadow: 0 0 8px var(--primary);
  }
  
  &:hover::after {
    width: 100%;
  }
  
  svg {
    margin-right: 0.25rem;
  }
`;

const ActionSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--text-secondary);
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--primary);
    background: rgba(0, 180, 216, 0.1);
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1.5rem;
  padding: 0.3rem 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 200px;
  transition: all 0.3s ease;
  
  &:focus-within {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(0, 180, 216, 0.2);
    width: 300px;
  }
  
  @media (max-width: 992px) {
    width: 160px;
    
    &:focus-within {
      width: 200px;
    }
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchInput = styled.input`
  background: none;
  border: none;
  color: var(--text-primary);
  padding: 0.3rem 0.5rem;
  width: 100%;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: var(--text-tertiary);
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -2px;
  right: -2px;
  background: var(--danger);
  color: white;
  font-size: 0.6rem;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  box-shadow: 0 0 6px var(--danger);
`;

const MobileMenuButton = styled(IconButton)`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 70px;
  left: 0;
  width: 100%;
  height: calc(100vh - 70px);
  background: var(--background);
  z-index: 999;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const MobileLink = styled(Link)`
  color: var(--text-primary);
  font-family: 'Exo', sans-serif;
  font-size: 1.2rem;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-radius: 0.5rem;
  
  ${props => props.active && `
    background: rgba(0, 180, 216, 0.1);
    color: var(--primary);
  `}
  
  svg {
    filter: ${props => props.active ? 'drop-shadow(0 0 3px var(--primary))' : 'none'};
  }
`;

const MobileDivider = styled.div`
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0.5rem 0;
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1rem;
  padding: 0.25rem 0.75rem;
  background: ${props => props.active ? 'rgba(6, 214, 160, 0.1)' : 'rgba(230, 57, 70, 0.1)'};
  border-radius: 1rem;
  border: 1px solid ${props => props.active ? 'rgba(6, 214, 160, 0.3)' : 'rgba(230, 57, 70, 0.3)'};
  
  @media (max-width: 992px) {
    display: none;
  }
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.active ? 'var(--success)' : 'var(--danger)'};
  margin-right: 0.5rem;
  box-shadow: 0 0 5px ${props => props.active ? 'var(--success)' : 'var(--danger)'};
`;

const StatusText = styled.span`
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${props => props.active ? 'var(--success)' : 'var(--danger)'};
  font-weight: 600;
`;

// Navbar component
const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSystemActive, setIsSystemActive] = useState(true);
  const [notificationCount, setNotificationCount] = useState(3);
  
  // Close mobile menu on location change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  // Check if current path matches link path
  const isActive = (path) => location.pathname === path;
  
  // Toggle mobile menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  return (
    <>
      <NavContainer
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      >
        <LogoSection>
          <Logo to="/">
            <Shield size={24} color="#00b4d8" />
            <span>NetSecMon</span>
          </Logo>
          
          <StatusIndicator active={isSystemActive}>
            <StatusDot active={isSystemActive} />
            <StatusText active={isSystemActive}>
              {isSystemActive ? 'System Active' : 'System Inactive'}
            </StatusText>
          </StatusIndicator>
        </LogoSection>
        
        <NavLinks>
          <NavLink to="/Dashboard" active={isActive('/Dashboard') ? 1 : 0}>
            <BarChart2 size={16} /> Dashboard
          </NavLink>
          <NavLink to="/Analysis" active={isActive('/Analysis') ? 1 : 0}>
            <Activity size={16} /> Analysis
          </NavLink>
          <NavLink to="/Security" active={isActive('/Security') ? 1 : 0}>
            <Shield size={16} /> Security
          </NavLink>
        </NavLinks>
        
        <ActionSection>
          <SearchContainer>
            <Search size={16} color="var(--text-tertiary)" />
            <SearchInput placeholder="Search..." />
          </SearchContainer>
          
          <IconButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell size={20} />
            {notificationCount > 0 && <NotificationBadge>{notificationCount}</NotificationBadge>}
          </IconButton>
          
          <IconButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings size={20} />
          </IconButton>
          
          <MobileMenuButton
            onClick={toggleMenu}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </MobileMenuButton>
        </ActionSection>
      </NavContainer>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <MobileMenu
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <MobileLink to="/Dashboard" active={isActive('/Dashboard')}>
              <BarChart2 size={20} />
              Dashboard
            </MobileLink>
            <MobileLink to="/Analysis" active={isActive('/Analysis')}>
              <Activity size={20} />
              Analysis
            </MobileLink>
            <MobileLink to="/Security" active={isActive('/Security')}>
              <Shield size={20} />
              Security
            </MobileLink>
            
            <MobileDivider />
            
            <MobileLink to="/profile">
              <User size={20} />
              Profile
            </MobileLink>
            <MobileLink to="/settings">
              <Settings size={20} />
              Settings
            </MobileLink>
            <MobileLink to="/logout">
              <LogOut size={20} />
              Logout
            </MobileLink>
          </MobileMenu>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
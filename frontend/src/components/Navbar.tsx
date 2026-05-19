import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h2 className="logo">⚡ DeployForge</h2>
        </div>

        <div className="navbar-menu">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="github-link">
            GitHub
          </a>
          
          <div className="user-menu">
            {user.avatar && (
              <img src={user.avatar} alt={user.username} className="avatar" />
            )}
            <span className="username">{user.username}</span>
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

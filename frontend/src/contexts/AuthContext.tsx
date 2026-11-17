import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authAPI } from '../services/api';

export interface User {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  githubId: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: () => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');
    if (tokenFromUrl) {
      localStorage.setItem('authToken', tokenFromUrl);
      return tokenFromUrl;
    }
    return localStorage.getItem('authToken');
  });

  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    const userFromUrl = params.get('user');
    if (userFromUrl) {
      try {
        const parsed = JSON.parse(decodeURIComponent(userFromUrl)) as User;
        localStorage.setItem('user', JSON.stringify(parsed));
        return parsed;
      } catch {
        // ignore parse error
      }
    }
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        return JSON.parse(stored) as User;
      } catch {
        // ignore parse error
      }
    }
    return null;
  });

  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  // Clean URL parameters after OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('token') || params.get('user')) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const login = () => {
    authAPI.login();
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    setToken(null);
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    setUser,
    setToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

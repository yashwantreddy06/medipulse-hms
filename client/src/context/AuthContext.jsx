import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('medipulse_token') || null);
  const [loading, setLoading] = useState(true);

  // Check user profile on initial app load using stored JWT token
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const storedToken = localStorage.getItem('medipulse_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await axiosClient.get('/auth/me');
        if (response.data && response.data.success) {
          setUser(response.data.user);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Session verification failed:', err.response?.data?.message || err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // Login handler
  const login = async (email, password) => {
    const response = await axiosClient.post('/auth/login', { email, password });
    if (response.data && response.data.success) {
      const { token: receivedToken, user: receivedUser } = response.data;
      localStorage.setItem('medipulse_token', receivedToken);
      localStorage.setItem('medipulse_user', JSON.stringify(receivedUser));
      setToken(receivedToken);
      setUser(receivedUser);
      return response.data;
    }
    throw new Error(response.data?.message || 'Login failed');
  };

  // Register handler
  const register = async (name, email, password) => {
    const response = await axiosClient.post('/auth/register', { name, email, password });
    if (response.data && response.data.success) {
      const { token: receivedToken, user: receivedUser } = response.data;
      localStorage.setItem('medipulse_token', receivedToken);
      localStorage.setItem('medipulse_user', JSON.stringify(receivedUser));
      setToken(receivedToken);
      setUser(receivedUser);
      return response.data;
    }
    throw new Error(response.data?.message || 'Registration failed');
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('medipulse_token');
    localStorage.removeItem('medipulse_user');
    setToken(null);
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin,
        login,
        register,
        logout,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch profile', error);
      logout();
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const loginUser = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token: newToken, user: userData } = response.data;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    return response.data;
  };

  const registerUser = async (userData) => {
    const response = await api.post('/auth/register', userData);
    const { token: newToken, user: newUserData } = response.data;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(newUserData);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const toggleBookmark = async (schemeId) => {
    try {
      await api.post(`/auth/bookmark/${schemeId}`);
      // Refresh user profile to get updated bookmarks
      await fetchProfile();
    } catch (error) {
      console.error('Error toggling bookmark', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, registerUser, logout, toggleBookmark, fetchProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

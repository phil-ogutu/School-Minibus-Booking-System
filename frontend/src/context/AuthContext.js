// src/context/AuthContext.js
import React from 'react';
import { BASE_URL } from '@/utils/constants';
import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already authenticated (e.g., from cookies)
  const checkAuth = async () => {
    console.log('CKECKAUTH: called' )
    try {
      const response = await fetch(`${BASE_URL}/api/users/me`, {
        credentials: 'include',
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setUser(null); // Handle unauthorized status
      }
    } catch (error) {
      console.error('Auth check failed:', error);
       setUser(null); // Set to null if there's an err.
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []); 
  return (
    <AuthContext.Provider value={{ user, setUser, loading, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
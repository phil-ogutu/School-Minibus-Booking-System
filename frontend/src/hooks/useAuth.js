// src/hooks/useAuth.js
import { useState, useContext } from 'react';
import { useMutation } from './useMutation';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const { mutate } = useMutation('/api/auth');
  const { user, setUser } = useContext(AuthContext);
  const [authError, setAuthError] = useState(null);

  const login = async (credentials) => {
    try {
      const data = await mutate({
        ...credentials,
        action: 'login',
      });
      setUser(data.user);
      return data;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await mutate({
        ...userData,
        action: 'register',
      });
      setUser(data.user);
      return data;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // logout endpoin later implementation
      setUser(null);
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  return {
    user,
    login,
    register,
    logout,
    authError,
    isAuthenticated: !!user,
  };
};
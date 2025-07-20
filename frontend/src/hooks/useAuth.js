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

      console.log("LOGIN RESPONSE:", data); // Debug log

      if (data && data.user) {
        setUser(data.user);
      } else {
        throw new Error('Invalid response: missing user');
      }

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

      console.log("REGISTER RESPONSE:", data); // Debug log

      if (data && data.user) {
        setUser(data.user);
      } else {
        throw new Error('Invalid response: missing user');
      }

      return data;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // logout endpoint to be implemented later
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

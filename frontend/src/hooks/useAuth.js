// src/hooks/useAuth.js
import { useState, useContext } from 'react';
import { useMutation } from './useMutation';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {  
  const { mutate } = useMutation(`/api/auth`);
  const { user, setUser, checkAuth } = useContext(AuthContext);
  const [authError, setAuthError] = useState(null);

  const login = async (credentials) => {
    try {
      const data = await mutate({
        ...credentials,
        action: 'login',
      });
      setUser(data.user); // This may not be needed if checkAuth refetches user data
      await checkAuth(); // Fetch user details from /me endpoint after login
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
    // const { mutate } = useMutation(`/api/auth`,'DELETE');
    try {
      // const response = await mutate();
      // if (response.ok){
        
      // }
      setUser(null); // Reset user state
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
// src/hooks/useAuth.js
'use client'
import { useState, useContext } from 'react';
import { useMutation } from './useMutation';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export const useAuth = () => {  
  const { mutate } = useMutation(`/api/auth`);
  const { user, setUser, checkAuth } = useContext(AuthContext);
  const [authError, setAuthError] = useState(null);
  const router = useRouter()

  const login = async (credentials) => {
    try {
      const data = await mutate({
        ...credentials,
        action: 'login',
      });
      setUser(data.user); // This may not be needed if checkAuth refetches user data
      await checkAuth(); // Fetch user details from /me endpoint after login
      router.push('/');
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
      router.push('/');
      return data;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const { mutate: logoutUser } = useMutation(`/api/auth`,'DELETE');
  const logout = async () => {
    try {
      const response = await logoutUser();
      if (response.ok){
        setUser(null); // Reset user state
      }
      return router.push('/');
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
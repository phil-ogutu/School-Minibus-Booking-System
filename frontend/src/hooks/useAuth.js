import { useState, useContext } from 'react';
import { useMutation } from './useMutation';
import { AuthContext } from '../context/AuthContext'; 

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

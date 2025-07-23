// context/UserContext.js
"use client";
import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '@/lib/api';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get('/users/1'); // Replace with dynamic user ID if needed (**logged in user/parent - through the /users/me endpoint)
      setUser(response.data); // Assuming `bookings` is part of the user data
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []); // Fetch user data once on mount

  const refetchBookings = async () => {
    try {
      const response = await axiosInstance.get(`/users/${user.id}/bookings`); // Adjust based on your API structure
      setUser((prevUser) => ({
        ...prevUser,
        bookings: response.data, // Update bookings directly in user data
      }));
    } catch (err) {
      console.error('Error refetching bookings:', err);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, error, refetchBookings, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export { UserProvider, useUser };



// src/hooks/useBookings.js
import { useState } from 'react';
import { useFetch } from './useFetch';
import { useMutation } from './useMutation'; // ✅ Correct

export const useBookings = () => {
  const { data: bookings, loading: bookingsLoading, error: bookingsError } = useFetch('/api/bookings');
  const { mutate: createBooking, loading: creatingBooking } = useMutation('/api/bookings');
  const { mutate: updateBooking } = useMutation('/api/bookings', 'PATCH');
  const { mutate: deleteBooking } = useMutation('/api/bookings', 'DELETE');

    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);

  const getBookingById = (id) => {
    const { data, loading, error } = useFetch(`/api/buses/api/bookings/${id}`);
    return { booking: data, loading, error };
  };

  const createNewBooking = async (bookingData) => {
    setCreating(true);
    try {
      await createBooking(bookingData);
      await fetchBookings();
    } catch (error) {
      console.error("Error creating bus:", error);
    }
  };

  const updateExistingBooking = async (id, updates) => {
    setUpdating(true)
    try {
      await updateBooking(updates, `/api/bookings/${id}`);
      await fetchBookings();
    } catch (error) {
      console.error("Error updating bus:", error);
    }
  };

  const deleteExistingBooking = async (id) => {
    setDeleting(true);
    try {
      await deleteBooking({}, `/api/bookings/${id}`);
      await fetchBookings(); // UI update
    } catch (error) {
      console.error("Error deleting bus:", error);
    }
  };

  // Refetch buses to update the UI
  const fetchBookings = async () => {
    await refetch(); // Triggering the refetch from the `useFetch` hook
  };

  return {
    bookings,
    bookingsLoading,
    bookingsError,
    creating,
    updating,
    deleting,
    getBookingById,
    createNewBooking,
    updateExistingBooking,
    deleteExistingBooking,
    creatingBooking,
    fetchBookings,
  };
};

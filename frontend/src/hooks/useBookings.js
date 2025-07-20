// src/hooks/useBookings.js
import { useFetch } from './useFetch';
import { useMutation } from './useMutation'; // ✅ Correct

export const useBookings = () => {
  const { data: bookings, loading: bookingsLoading, error: bookingsError } = useFetch('/api/bookings');
  const { mutate: createBooking, loading: creatingBooking } = useMutation('/api/bookings');
  const { mutate: updateBooking } = useMutation('/api/bookings', 'PATCH');
  const { mutate: deleteBooking } = useMutation('/api/bookings', 'DELETE');

  const getBookingById = (id) => {
    const { data, loading, error } = useFetch(`/api/bookings/${id}`);
    return { booking: data, loading, error };
  };

  const createNewBooking = async (bookingData) => {
    return await createBooking(bookingData);
  };

  const updateExistingBooking = async (id, updates) => {
    return await updateBooking(updates, `/api/bookings/${id}`);
  };

  const deleteExistingBooking = async (id) => {
    return await deleteBooking({}, `/api/bookings/${id}`);
  };

  return {
    bookings,
    bookingsLoading,
    bookingsError,
    getBookingById,
    createNewBooking,
    updateExistingBooking,
    deleteExistingBooking,
    creatingBooking,
  };
};

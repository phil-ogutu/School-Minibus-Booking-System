import { useFetch, useMutation } from './useFetch';

export const useBookings = () => {
  const { data: bookings, loading: bookingsLoading, error: bookingsError } = useFetch('/api/bookings');
  const { mutate: createBooking, loading: creatingBooking } = useMutation('/api/bookings');
  const { mutate: updateBooking } = useMutation('/api/bookings', 'PATCH');
  const { mutate: deleteBooking } = useMutation('/api/bookings', 'DELETE');



  const getBookingById = (id) => {
    const { data, loading, error } = useFetch(`/api/bookings/${id}`);
    return { booking: data, loading, error };
  };




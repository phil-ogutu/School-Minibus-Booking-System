import { useFetch, useMutation } from './useFetch';

export const useBookings = () => {
  const { data: bookings, loading: bookingsLoading, error: bookingsError } = useFetch('/api/bookings');
    const { mutate: createBooking, loading: creatingBooking } = useMutation('/api/bookings');


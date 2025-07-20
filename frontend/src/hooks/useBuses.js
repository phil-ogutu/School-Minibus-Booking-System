// src/hooks/useBuses.js
import { useFetch, useMutation } from './useFetch';

export const useBuses = () => {
  const { data: buses, loading: busesLoading, error: busesError } = useFetch('/api/buses');

  const getBusById = (id) => {
    const { data, loading, error } = useFetch(`/api/buses/${id}`);
    return { bus: data, loading, error };
  };

  return {
    buses,
    busesLoading,
    busesError,
    getBusById,
  };
};

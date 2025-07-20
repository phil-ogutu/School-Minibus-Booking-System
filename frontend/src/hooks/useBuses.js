// src/hooks/useBuses.js
import { useFetch, useMutation } from './useFetch';

export const useBuses = () => {
  const { data: buses, loading: busesLoading, error: busesError } = useFetch('/api/buses');
  const { mutate: createBus } = useMutation('/api/buses');
  const { mutate: updateBus } = useMutation('/api/buses', 'PATCH');
  const { mutate: deleteBus } = useMutation('/api/buses', 'DELETE');

  const getBusById = (id) => {
    const { data, loading, error } = useFetch(`/api/buses/${id}`);
    return { bus: data, loading, error };
  };

  const createNewBus = async (busData) => {
    return await createBus(busData);
  };

  const updateExistingBus = async (id, updates) => {
    return await updateBus(updates, `/api/buses/${id}`);
  };

  const deleteExistingBus = async (id) => {
    return await deleteBus({}, `/api/buses/${id}`);
  };

  return {
    buses,
    busesLoading,
    busesError,
    getBusById,
    createNewBus,
    updateExistingBus,
    deleteExistingBus,
  };
};
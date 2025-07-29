// src/hooks/useBuses.js
import { useState } from 'react';
import { useFetch } from './useFetch';
import { useMutation } from './useMutation';

export const useBuses = (url) => {
  const { data: buses, loading: busesLoading, error: busesError, refetch } = useFetch(url ?? '/api/buses');
  const { mutate: createBus } = useMutation('/api/buses'); // Mutations expect a full url
  const { mutate: updateBus } = useMutation('/api/buses', 'PATCH');
  const { mutate: deleteBus } = useMutation('/api/buses', 'DELETE');
  
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const getBusById = (id) => {
    const { data, loading, error } = useFetch(`/api/buses/${id}`);
    return { bus: data, loading, error };
  };

  const createNewBus = async (busData) => {
    setCreating(true);
    try {
      await createBus(busData);
      await fetchBuses();
    } catch (error) {
      console.error("Error creating bus:", error);
    }
  };

  const updateExistingBus = async (id, updates) => {
    setUpdating(true)
    try {
      await updateBus(updates, `/api/buses/${id}`);
      await fetchBuses();
    } catch (error) {
      console.error("Error updating bus:", error);
    }
  };

  const deleteExistingBus = async (id) => {
    setDeleting(true);
    try {
      await deleteBus({}, `/api/buses/${id}`);
      await fetchBuses(); // UI update
    } catch (error) {
      console.error("Error deleting bus:", error);
    }
  };

  // Refetch buses to update the UI
  const fetchBuses = async () => {
    await refetch(); // Triggering the refetch from the `useFetch` hook
  };

  return {
    buses,
    busesLoading,
    busesError,
    creating,
    updating,
    deleting,
    getBusById,
    createNewBus,
    updateExistingBus,
    deleteExistingBus,
    fetchBuses,
  };
};

//

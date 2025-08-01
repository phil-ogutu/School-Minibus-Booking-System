// src/hooks/useRoutes.js
import { useState } from 'react';
import { useFetch } from './useFetch';
import { useMutation } from './useMutation';
import { BASE_URL } from '@/utils/constants';


export const useRoutes = (url) => {
  const { data: routes, loading: routesLoading, error: routesError, refetch } = useFetch(url ?? '/api/routes?page=1');
  const { mutate: createRoute } = useMutation('/api/routes');
  const { mutate: updateRoute } = useMutation('/api/routes', 'PATCH');
  const { mutate: deleteRoute } = useMutation('', 'DELETE');

  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const getRouteById = (id) => {
    const { data, loading, error } = useFetch(`/api/routes/${id}`);
    return { route: data, loading, error };
  };

  const createNewRoute = async (routeData) => {
    setCreating(true);
    try {
      await createRoute(routeData);
      await fetchRoutes();
    } catch (error) {
      console.error("Error creating route:", error);
    }
  };

  const updateExistingRoute = async (id, updates) => {
    setUpdating(true)
    try {
      await updateRoute(updates, `/api/routes/${id}`);
      await fetchRoutes();
    } catch (error) {
      console.error("Error updating bus:", error);
    }
  };

  const deleteExistingRoute = async (id) => {
    setDeleting(true);
    try {
      await deleteRoute({}, `/api/routes/${id}`);
      await fetchRoutes(); 
    } catch (error) {
      console.error("Error deleting route:", error);
    }
  };

  // Refetch buses to update the UI
  const fetchRoutes = async () => {
    await refetch(); // Triggering the refetch from the `useFetch` hook
  };

  return {
    routes,
    routesLoading,
    routesError,
    creating,
    updating,
    deleting,
    getRouteById,
    createNewRoute,
    updateExistingRoute,
    deleteExistingRoute,
    fetchRoutes,
  };
};
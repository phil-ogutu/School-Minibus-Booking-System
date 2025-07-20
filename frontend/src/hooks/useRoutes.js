// src/hooks/useRoutes.js
import { useFetch, useMutation } from './useFetch';

export const useRoutes = () => {
  const { data: routes, loading: routesLoading, error: routesError } = useFetch('/api/routes');
  const { mutate: createRoute } = useMutation('/api/routes');
  const { mutate: updateRoute } = useMutation('/api/routes', 'PATCH');
  const { mutate: deleteRoute } = useMutation('/api/routes', 'DELETE');

  const getRouteById = (id) => {
    const { data, loading, error } = useFetch(`/api/routes/${id}`);
    return { route: data, loading, error };
  };

  const createNewRoute = async (routeData) => {
    return await createRoute(routeData);
  };

  const updateExistingRoute = async (id, updates) => {
    return await updateRoute(updates, `/api/routes/${id}`);
  };

  const deleteExistingRoute = async (id) => {
    return await deleteRoute({}, `/api/routes/${id}`);
  };

  return {
    routes,
    routesLoading,
    routesError,
    getRouteById,
    createNewRoute,
    updateExistingRoute,
    deleteExistingRoute,
  };
};
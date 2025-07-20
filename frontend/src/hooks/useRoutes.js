// src/hooks/useRoutes.js
import { useFetch, useMutation } from './useFetch';

export const useRoutes = () => {
  const { data: routes, loading: routesLoading, error: routesError } = useFetch('/api/routes');
  const { mutate: createRoute } = useMutation('/api/routes');
  const { mutate: updateRoute } = useMutation('/api/routes', 'PATCH');

  const createNewRoute = async (routeData) => {
    return await createRoute(routeData);
  };

  const updateExistingRoute = async (id, updates) => {
    return await updateRoute(updates, `/api/routes/${id}`);
  };

  return {
    routes,
    routesLoading,
    routesError,
    createNewRoute,
    updateExistingRoute,
  };
};

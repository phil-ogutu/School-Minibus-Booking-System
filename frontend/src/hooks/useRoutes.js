// src/hooks/useRoutes.js
import { useFetch, useMutation } from './useFetch';

export const useRoutes = () => {
  const { data: routes, loading: routesLoading, error: routesError } = useFetch('/api/routes');
  const { mutate: createRoute } = useMutation('/api/routes');

  const createNewRoute = async (routeData) => {
    return await createRoute(routeData);
  };

  return {
    routes,
    routesLoading,
    routesError,
    createNewRoute,
  };
};

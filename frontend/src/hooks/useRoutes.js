// src/hooks/useRoutes.js
import { useFetch, useMutation } from './useFetch';

export const useRoutes = () => {
  const { data: routes, loading: routesLoading, error: routesError } = useFetch('/api/routes');

  return {
    routes,
    routesLoading,
    routesError,
  };
};

// src/hooks/useFetch.js
import { useState, useEffect, useCallback } from 'react';
import { BASE_URL } from "@/utils/constants";

export const useFetch = (url, options = {},refetchTrigger = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL = "http://localhost:5000";

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch(`${BASE_URL}${url}`, {
        ...options,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const jsonData = await response.json();
      setData(jsonData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url, JSON.stringify(options)]);

  useEffect(() => {
    fetchData();
  }, [url, JSON.stringify(options), fetchData]);

  useEffect(() => {
    if (refetchTrigger) {
      fetchData(); // Trigger fetch when refetchTrigger changes
    }
  }, [refetchTrigger, fetchData]);

  return { data, loading, error, refetch: fetchData};
};
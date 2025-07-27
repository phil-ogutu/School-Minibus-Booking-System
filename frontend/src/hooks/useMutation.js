// src/hooks/useMutation.js
import { useState } from 'react';
import { BASE_URL } from '@/utils/constants';

export const useMutation = (url, method = 'POST') => {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (body, customUrl = null) => {
    setLoading(true);
    try {
      const finalUrl = customUrl || url;
      const response = await fetch(`${BASE_URL}${finalUrl}`, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const err = await response?.text()
        console.log('response',err)
        throw new Error(err);
      }else{
        const jsonData = await response.json();
        setData(jsonData);
        return jsonData;
      }

    } catch (err) {
      console.log(err)
      setError(err.message);
      throw new Error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { mutate, data, loading, error };
};

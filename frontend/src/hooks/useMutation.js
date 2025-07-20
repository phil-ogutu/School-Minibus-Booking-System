// src/hooks/useMutation.js
import { useState } from 'react';

export const useMutation = (url, method = 'POST') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

// src/hooks/__tests__/useFetch.test.js
import { renderHook, waitFor } from '@testing-library/react';
import { useFetch } from '../useFetch';

// Mock global fetch
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ data: 'test' }),
    })
  );
});

test('fetches data successfully', async () => {
  const { result } = renderHook(() => useFetch('/api/test'));

  expect(result.current.loading).toBe(true);
  
  await waitFor(() => {
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual({ data: 'test' });
    expect(result.current.error).toBeNull();
  });
});
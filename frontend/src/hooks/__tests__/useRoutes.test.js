// src/hooks/__tests__/useRoutes.test.js
import { renderHook, act } from '@testing-library/react';
import { useRoutes } from '../useRoutes';

jest.setTimeout(15000);

beforeEach(() => {
  global.fetch = jest.fn((url, options) => {
    if (url === '/api/routes' && (!options || options.method === 'GET')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ id: 1, name: 'Test Route' }]),
      });
    }

    if (url === '/api/routes' && options.method === 'POST') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 2, name: 'Created Route' }),
      });
    }

    return Promise.resolve({
      ok: false,
      json: () => Promise.resolve({}),
    });
  });
});

test('creates a new route', async () => {
  const { result } = renderHook(() => useRoutes());

  await act(async () => {
    await result.current.createNewRoute({ name: 'New Route' });
  });

  expect(global.fetch).toHaveBeenCalledWith('/api/routes', expect.objectContaining({
    method: 'POST'
  }));
});

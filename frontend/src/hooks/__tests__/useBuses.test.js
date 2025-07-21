// src/hooks/__tests__/useBuses.test.js
import { renderHook, act } from '@testing-library/react';
import { useBuses } from '../useBuses';

jest.setTimeout(15000);

beforeEach(() => {
  global.fetch = jest.fn((url, options) => {
    if (url === '/api/buses' && (!options || options.method === 'GET')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ id: 1, name: 'Test Bus' }]),
      });
    }

    if (url === '/api/buses' && options.method === 'POST') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 2, name: 'Created Bus' }),
      });
    }

    if (url === '/api/buses/1' && options.method === 'DELETE') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    }

    return Promise.resolve({ ok: false, json: () => Promise.resolve({}) });
  });
});

test('deletes a bus', async () => {
  const { result } = renderHook(() => useBuses());

  await act(async () => {
    await result.current.deleteExistingBus(1);
  });

  expect(global.fetch).toHaveBeenCalledWith('/api/buses/1', expect.objectContaining({
    method: 'DELETE'
  }));
});

// __tests__/useBookings.test.js
import { renderHook, waitFor } from '@testing-library/react';
import { useBookings } from '../useBookings';

const BASE_URL = "http://127.0.0.1:5000"; // same as in useFetch.js

jest.setTimeout(15000);

// Mock global.fetch before each test
beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url === `${BASE_URL}/api/bookings`) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ id: 1, bus_id: 2, route_id: 3 }]),
      });
    }

    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    });
  });
});

test('fetches bookings list', async () => {
  const { result } = renderHook(() => useBookings());

  await waitFor(() => {
    expect(result.current.bookings).toEqual([
      { id: 1, bus_id: 2, route_id: 3 },
    ]);
  });
});

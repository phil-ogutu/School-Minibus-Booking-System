import { renderHook, waitFor } from '@testing-library/react';
import { useBookings } from '../useBookings';

jest.setTimeout(15000);

beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url === '/api/bookings') {
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

// src/hooks/__tests__/useMutation.test.js
import { renderHook, act } from '@testing-library/react'; // Add act import
import { useMutation } from '../useMutation';

describe('useMutation', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    );
  });

  test('performs POST mutation', async () => {
    const { result } = renderHook(() => useMutation('/api/test'));

    await act(async () => {
      await result.current.mutate({ key: 'value' });
    });

    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
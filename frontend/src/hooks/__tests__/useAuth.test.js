import React from 'react'; 
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { AuthProvider } from '../../context/AuthContext';

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

describe('useAuth', () => {
  beforeEach(() => {
    global.fetch = jest.fn((url) => {
      if (url === '/api/users/me') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: 1 }),
        });
      }

      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ user: { id: 1 } }),
      });
    });
  });

  test('login works correctly', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password'
      });
    });

    expect(global.fetch).toHaveBeenCalledTimes(2); // one for useEffect, one for login
    expect(result.current.user).toEqual({ id: 1 });
  });
});

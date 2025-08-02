// src/utils/socket.js
import { io } from 'socket.io-client';
import { BASE_URL } from './constants';

let socket = null;

export const getSocket = () => {
  if (socket) return socket;

  if (typeof window !== 'undefined') {
    socket = io(BASE_URL, { // Replace with actual backend URL
      withCredentials: true,
      transports: ["websocket"]
    });
  }
  return socket;
};
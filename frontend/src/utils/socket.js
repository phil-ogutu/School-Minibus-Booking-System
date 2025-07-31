// src/utils/socket.js
import { io } from 'socket.io-client';

let socket = null;

export const getSocket = () => {
  if (socket) return socket;

  if (typeof window !== 'undefined') {
    socket = io("http://localhost:5000", { // Replace with actual backend URL
      withCredentials: true,
      transports: ["websocket"]
    });
  }
  return socket;
};


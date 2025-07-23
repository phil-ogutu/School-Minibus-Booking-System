// src/components/DriverTracker.jsx
'use client'
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5555'); // Flask-SocketIO backend

export default function DriverTracker({ busId }) {
  const [isTracking, setIsTracking] = useState(false);
  const watchIdRef = useRef(null);

  const startTracking = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported!");
      return;
    }

    setIsTracking(true);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Send location to backend via WebSocket
        socket.emit('bus_location_update', {
          bus_id: busId,
          lat: latitude,
          lng: longitude
        });

        console.log("Sent location:", latitude, longitude);
      },
      (error) => {
        console.error("Location error:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000
      }
    );
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      setIsTracking(false);
      alert("Tracking stopped");
    }
  };

  return (
    <div className="space-y-4 p-5 border">
      <h1 className="text-lg font-bold">Driver Bus Tracker</h1>

      <button
        onClick={startTracking}
        disabled={isTracking}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Start Tracking
      </button>

      <button
        onClick={stopTracking}
        disabled={!isTracking}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Stop Tracking
      </button>
    </div>
  );
}


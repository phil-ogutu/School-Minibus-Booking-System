// app/driver/trip/[id]/tracking/page.jsx
"use client"

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import io from 'socket.io-client';
import SimulatedTrackerMap from '@/app/driver/components/SimulatedTrackerMap';
import { BASE_URL } from '@/utils/constants';
import { useSocketTracking } from '@/hooks/useSocketTracking';
import { useBuses } from '@/hooks/useBuses';

let socket;

export default function DriverTrackingPage() {
  const params = useParams();
  const trip_id = params.id;

  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [tracking, setTracking] = useState(true); // start tracking by default
  const watchIdRef = useRef(null); // store the watchId persistently
  const { roomEmitter } = useSocketTracking();
  const { getBusById } = useBuses();
  const {bus} = getBusById(trip_id);
  console.log(bus)
  // const {roomEmitter} = useSocketTracking()

  // console.log('roomEmitter',roomEmitter(bus?.tracking_room))

  // Connect to socket.io server
  useEffect(() => {
    socket = io(BASE_URL, {
      withCredentials: true,  // Ensure cookies are sent
      transports: ["websocket"]  // To use WebSockets as transport
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Manage geolocation tracking
  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    if (tracking) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({ latitude, longitude });

          socket.emit('bus_location_update', {
            driver_id: 1, // replace with real driver ID (logged in as driver)
            trip_id,
            latitude,
            longitude,
            speed: 15,  // Temporary 
            timestamp: new Date().toISOString()
          });
          roomEmitter("send bus location update", {
            bus_id: trip_id,
            latitude,
            latitude,
          });
          roomEmitter('join tracking group', {
            bus_id: trip_id,
          })          
        },
        (err) => {
          console.error("Location error:", err);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 10000,
        }
      );
    } else if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    socket.on("join tracking group",(data)=>{
      console.log(data)
    });

    // Cleanup on unmount
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [tracking, trip_id]);
  
  return (
    <> 
    <div className='p-8'>
      <h1 className='font-bold '>Live Location</h1>
      <h1>Tracking Trip {trip_id}</h1>
      <p>Latitude: {location.latitude ?? "Waiting..."}</p>
      <p>Longitude: {location.longitude ?? "Waiting..."}</p>

      <div className="mt-4">
        {tracking ? (
          <button
            onClick={() => {setTracking(false) 
                alert('Tracking Stopped.')}}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Stop Tracking
          </button>
        ) : (
          <button
            onClick={() => {setTracking(true) 
                alert('Tracking Resumed.')}}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Start Tracking
          </button>
        )}
      </div>
    </div>

    {/* Simulated Map Component */}
    <SimulatedTrackerMap />
    </>
  );
}

// Include a button to simulate tracking and a map with bus marker for the same
// Emit the coordinates when a dropoff (location is reached). The server should be able to send update to the parent (client)
// src/components/SimulatedBusTracker.jsx
'use client'
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { io } from 'socket.io-client';

import 'leaflet/dist/leaflet.css'; // **Important for proper styling

const socket = io('http://localhost:5555'); // adjust to the Flask backend base URL

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

export default function SimulatedBusTracker({ busId = 1 }) {
  const [position, setPosition] = useState({ lat: -1.2921, lng: 36.8219 }); // default to Nairobi

  // Emit whenever marker is dragged
  const handleDragEnd = (e) => {
    const { lat, lng } = e.target.getLatLng();
    setPosition({ lat, lng });

    socket.emit('bus_location_update', {
      bus_id: busId,
      lat,
      lng
    });

    console.log("Simulated position sent:", lat, lng);
  };

  return (
    <div className="h-[500px] border p-4 rounded-xl bg-white shadow-sm">
      <h2 className="font-bold mb-3 text-lg">Simulated Bus Tracker</h2>

      <div className="h-[420px] rounded-md overflow-hidden">
        <MapContainer
          center={position}
          zoom={15}
          className="h-full w-full"
          scrollWheelZoom={true}
          zoomControl={true} //  ensures the +/− controls show
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={position}
            icon={markerIcon}
            draggable={true}
            eventHandlers={{ dragend: handleDragEnd }}
          >
            <Popup>
              Bus Position<br />Drag me to simulate movement!
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}

'use client'
import React, { useEffect, useRef, useState } from 'react';
import { busIcon, groupIcon, mapPinIcon, playIcon} from '@/components/ui/icons.js';

const SchoolBusRoute = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const routeData = {
    name: "Route Name",
    date: "21 Nov 2024",
    stops: 3,
    children: 15,
    status: "pending"
  };

  const routeCoordinates = [
    [-1.1, 37.0],
    [-1.05, 36.95],
    [-1.0, 36.9],
    [-0.95, 36.85],
    [-0.9, 36.8],
    [-0.85, 36.75],
  ];

  const busStops = [
    { lat: -1.1, lng: 37.0, name: "Stop 1" },
    { lat: -0.95, lng: 36.85, name: "Stop 2" },
    { lat: -0.85, lng: 36.75, name: "Stop 3" }
  ];

  useEffect(() => {
    // Load Leaflet CSS and JS
    const loadLeaflet = async () => {
      // Load CSS
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
      document.head.appendChild(cssLink);

      // Load JS
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
      script.onload = () => {
        setIsMapLoaded(true);
      };
      document.head.appendChild(script);
    };

    loadLeaflet();

    return () => {
      // Cleanup
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (isMapLoaded && mapRef.current && !mapInstance.current) {
      // Initialize the map
      mapInstance.current = window.L.map(mapRef.current).setView([-0.975, 36.875], 11);

      // Add tile layer
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance.current);

      // Create custom bus icon
      const busIconPinned = window.L.divIcon({
        html: `<div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-lg">
                 ${busIcon('text-dark','text-2xl')}
               </div>`,
        className: 'custom-bus-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      // Add bus marker at the end of route
      window.L.marker(routeCoordinates[routeCoordinates.length - 1], { icon: busIconPinned })
        .addTo(mapInstance.current);

      // Create route polyline
      const routeLine = window.L.polyline(routeCoordinates, {
        color: '#EAAA00',
        weight: 4,
        opacity: 0.8
      }).addTo(mapInstance.current);

      // Add bus stop markers
      busStops.forEach((stop, index) => {
        const stopIcon = window.L.divIcon({
          html: `<div class="w-6 h-6 bg-dark rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-md">
                   ${index + 1}
                 </div>`,
          className: 'custom-stop-marker',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        window.L.marker([stop.lat, stop.lng], { icon: stopIcon })
          .bindPopup(stop.name)
          .addTo(mapInstance.current);
      });

      // Fit map to show the route
      mapInstance.current.fitBounds(routeLine.getBounds(), { padding: [20, 20] });
    }
  }, [isMapLoaded]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Map Container */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="w-full h-full" />
        
        {/* Mobile Route Info Overlay (Bottom) - Hidden on desktop */}
        <div className="md:hidden absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-xl border-t border-gray-200 z-1000">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                {busIcon('text-white','text-2xl')}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{routeData.name}</h3>
                <p className="text-sm text-gray-500">{routeData.date}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {mapPinIcon()}
                <span>{routeData.stops} stops</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {groupIcon()}
                <span>{routeData.children} children</span>
              </div>
            </div>

            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-primary text-dark rounded-full text-sm font-medium">
                {routeData.status}
              </span>
            </div>

            <button className="w-full bg-primary hover:bg-dark text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors">
              {playIcon()}
              Start Ride
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden md:block w-80 bg-white shadow-xl">
        <div className="p-6 h-full flex flex-col">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                {busIcon('text-white','text-2xl')}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{routeData.name}</h2>
                <p className="text-gray-500">{routeData.date}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              {mapPinIcon()}              <div>
                <p className="text-sm text-gray-600">Stops</p>
                <p className="font-semibold">{routeData.stops}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              {groupIcon()}              <div>
                <p className="text-sm text-gray-600">Children</p>
                <p className="font-semibold">{routeData.children}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Status</p>
              <span className="inline-block px-2 py-1 bg-primary text-dark rounded-full text-sm font-medium">
                {routeData.status}
              </span>
            </div>
          </div>

          <div className="mt-auto">
            <button className="w-full bg-primary hover:bg-dark text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors">
              {playIcon()}Start Ride
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolBusRoute;
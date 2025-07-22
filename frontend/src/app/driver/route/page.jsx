'use client'
import React, { useEffect, useRef, useState } from 'react';
import { busIcon, groupIcon, mapPinIcon, playIcon} from '@/components/ui/icons.js';

const SchoolBusRoute = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Sample route data
  const routeData = {
    name: "Route Name",
    date: "21 Nov 2024",
    stops: 3,
    children: 15,
    status: "pending"
  };

  // More realistic bus stops for better road routing (Kenya coordinates)
  const busStops = [
    { lat: -1.105225, lng: 37.016789, name: "JKUAT Entry road" },
    { lat: -1.120837, lng: 37.008421, name: "Thika Super Highway, Kalimoni" }, 
    { lat: -1.131100, lng: 36.981719, name: "Rubis Kimbo Service Station" }
  ];

  const [routeCoordinates, setRouteCoordinates] = useState([]);

  // Function to get route following roads using multiple routing attempts
  const getRouteFromStops = async (stops) => {
    try {
      // Validate stops input
      if (!stops || stops.length === 0) {
        console.warn('No valid stops provided for routing');
        return;
      }

      const validStops = stops.filter(stop => 
        stop && typeof stop?.lat === 'number' && typeof stop.lng === 'number'
      );

      if (validStops.length < 2) {
        console.warn('Need at least 2 valid stops for routing');
        const fallbackRoute = validStops.map(stop => [stop?.lat, stop.lng]);
        setRouteCoordinates(fallbackRoute);
        return;
      }

      // Try multiple routing services for better road-following
      const routingServices = [
        // OSRM with full geometry
        {
          name: 'OSRM',
          url: (waypoints) => `https://router.project-osrm.org/route/v1/driving/${waypoints}?overview=full&geometries=geojson&steps=true`
        },
        // Alternative OSRM endpoint
        {
          name: 'OSRM-Alt',
          url: (waypoints) => `https://router.project-osrm.org/route/v1/car/${waypoints}?overview=full&geometries=geojson`
        }
      ];

      // Create waypoints string for routing service
      const waypoints = validStops.map(stop => `${stop.lng},${stop?.lat}`).join(';');
      
      for (const service of routingServices) {
        try {
          console.log(`Trying ${service.name} routing service...`);
          const response = await fetch(service.url(waypoints));
          
          if (response.ok) {
            const data = await response.json();
            console.log(`${service.name} response:`, data);
            
            if (data.routes && data.routes[0] && data.routes[0].geometry) {
              const geometry = data.routes[0].geometry;
              
              if (geometry.coordinates && geometry.coordinates.length > 0) {
                // Convert coordinates from [lng, lat] to [lat, lng] for Leaflet
                const coordinates = geometry.coordinates
                  .filter(coord => coord && coord.length >= 2 && 
                          typeof coord[0] === 'number' && typeof coord[1] === 'number')
                  .map(coord => [coord[1], coord[0]]);
                
                if (coordinates.length > 2) { // Need more than 2 points for a good route
                  console.log(`Successfully got ${coordinates.length} route points from ${service.name}`);
                  setRouteCoordinates(coordinates);
                  return; // Success, exit function
                }
              }
            }
          }
        } catch (serviceError) {
          console.warn(`${service.name} failed:`, serviceError);
          continue; // Try next service
        }
      }

      // If all routing services fail, create detailed fallback route
      console.log('All routing services failed, creating enhanced fallback route');
      const enhancedRoute = [];
      
      for (let i = 0; i < validStops.length - 1; i++) {
        const start = validStops[i];
        const end = validStops[i + 1];
        
        // Add start point
        enhancedRoute.push([start?.lat, start.lng]);
        
        // Add intermediate points for smoother curves
        const latDiff = end?.lat - start?.lat;
        const lngDiff = end.lng - start.lng;
        const steps = Math.max(3, Math.floor(Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 100));
        
        for (let j = 1; j < steps; j++) {
          const ratio = j / steps;
          const lat = start?.lat + latDiff * ratio;
          const lng = start.lng + lngDiff * ratio;
          enhancedRoute.push([lat, lng]);
        }
      }
      
      // Add final point
      const lastStop = validStops[validStops.length - 1];
      enhancedRoute.push([lastStop?.lat, lastStop.lng]);
      
      setRouteCoordinates(enhancedRoute);
      
    } catch (error) {
      console.error('Complete routing failure:', error);
      // Final fallback to simple direct lines
      const validStops = stops.filter(stop => 
        stop && typeof stop?.lat === 'number' && typeof stop.lng === 'number'
      );
      const simpleRoute = validStops.map(stop => [stop?.lat, stop.lng]);
      setRouteCoordinates(simpleRoute);
    }
  };

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
      // Initialize the map with Nairobi center
      mapInstance.current = window.L.map(mapRef.current).setView([-1.092, 36.982], 12);

      // Add tile layer
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance.current);

      // Get route that follows roads
      getRouteFromStops(busStops);

      // Add bus stop markers with validation
      busStops.forEach((stop, index) => {
        // Validate stop coordinates
        if (!stop || typeof stop?.lat !== 'number' || typeof stop.lng !== 'number') {
          console.warn(`Invalid stop data at index ${index}:`, stop);
          return;
        }

        const stopIcon = window.L.divIcon({
          html: `<div class="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-md">
                   ${index + 1}
                 </div>`,
          className: 'custom-stop-marker',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        window.L.marker([stop?.lat, stop.lng], { icon: stopIcon })
          .bindPopup(stop.name || `Stop ${index + 1}`)
          .addTo(mapInstance.current);
      });

      // Fit map to show the bus stops initially
      const validStops = busStops.filter(stop => 
        stop && typeof stop?.lat === 'number' && typeof stop.lng === 'number'
      );
      
      if (validStops.length > 0) {
        const bounds = window.L?.latLngBounds(validStops.map(stop => [stop?.lat, stop.lng]));
        mapInstance.current.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [isMapLoaded]);

  // Effect to add route line when coordinates are available
  useEffect(() => {
    if (mapInstance.current && routeCoordinates.length > 0) {
      // Validate coordinates before using them
      const validCoordinates = routeCoordinates.filter(coord => 
        coord && Array.isArray(coord) && coord.length >= 2 && 
        typeof coord[0] === 'number' && typeof coord[1] === 'number'
      );

      if (validCoordinates.length === 0) {
        console.warn('No valid coordinates found for route');
        return;
      }

      // Create route polyline
      const routeLine = window.L.polyline(validCoordinates, {
        color: '#8B5CF6',
        weight: 4,
        opacity: 0.8
      }).addTo(mapInstance.current);

      // Create custom bus icon
      const busIconPinned = window.L.divIcon({
        html: `<div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-lg">
                
               </div>`,
        className: 'custom-bus-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      // Add bus marker at the end of route (use last valid coordinate)
      const lastCoord = validCoordinates[validCoordinates.length - 1];
      if (lastCoord) {
        window.L.marker(lastCoord, { icon: busIconPinned })
          .addTo(mapInstance.current);
      }

      // Fit map to show the complete route
      try {
        mapInstance.current.fitBounds(routeLine.getBounds(), { padding: [20, 20] });
      } catch (error) {
        console.warn('Could not fit bounds, using default view');
      }
    }
  }, [routeCoordinates]);

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
// 'use client';
// import React, { useEffect, useRef, useState } from 'react';
// import { loadLeaflet, L_Instance } from '@/utils/leaflet';
// import { getRouteFromStops } from '@/utils/route';

// const Map = ({ locations }) => {
//   const mapRef = useRef(null);
//   console.log("LOCATIONS IN MAP: ", locations)
//   const mapInstance = useRef(null);
//   const markersLayer = useRef(null);
//   const routeLayer = useRef(null);

//   const [isMapLoaded, setIsMapLoaded] = useState(false);
//   const [routeCoordinates, setRouteCoordinates] = useState([]);

//   // Load Leaflet
//   useEffect(() => {
//     loadLeaflet(setIsMapLoaded);

//     return () => {
//       if (mapInstance.current) {
//         mapInstance.current.remove();
//         mapInstance.current = null;
//       }
//     };
//   }, []);

//   // Initialize map once
//   useEffect(() => {
//     if (isMapLoaded && mapRef.current && !mapInstance.current) {
//       mapInstance.current = L_Instance.map(mapRef.current).setView([-1.092, 36.982], 12);

//       L_Instance.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '© OpenStreetMap contributors'
//       }).addTo(mapInstance.current);

//       markersLayer.current = L_Instance.layerGroup().addTo(mapInstance.current);
//     }
//   }, [isMapLoaded]);

//   // Update markers & fetch route when locations change
//   useEffect(() => {
//     if (!mapInstance.current || !locations || locations.length === 0) return;

//     // Clear old markers
//     markersLayer.current.clearLayers();

//     // Add new markers
//     locations.forEach((stop, index) => {
//       if (typeof stop?.latitude === 'number' && typeof stop?.longitude === 'number') {
//         const stopIcon = L_Instance.divIcon({
//           html: `<div class="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-md">
//             ${index + 1}
//           </div>`,
//           className: 'custom-stop-marker',
//           iconSize: [24, 24],
//           iconAnchor: [12, 12]
//         });

//         L_Instance.marker([stop.latitude, stop.longitude], { icon: stopIcon })
//           .bindPopup(stop.location_name || `Stop ${index + 1}`)
//           .addTo(markersLayer.current);
//       }
//     });

//     // Fit map to new markers
//     const validStops = locations.filter(
//       stop => typeof stop?.latitude === 'number' && typeof stop?.longitude === 'number'
//     );
//     if (validStops.length > 0) {
//       const bounds = L_Instance.latLngBounds(validStops.map(stop => [stop.latitude, stop.longitude]));
//       mapInstance.current.fitBounds(bounds, { padding: [20, 20] });
//     }

//     // Fetch route for new locations
//     getRouteFromStops(locations, setRouteCoordinates);
//   }, [locations]);

//   // Draw route when coordinates update
//   useEffect(() => {
//     if (!mapInstance.current) return;

//     // Remove previous route if exists
//     if (routeLayer.current) {
//       mapInstance.current.removeLayer(routeLayer.current);
//     }

//     if (routeCoordinates.length > 0) {
//       routeLayer.current = L_Instance.polyline(routeCoordinates, {
//         color: '#8B5CF6',
//         weight: 4,
//         opacity: 0.8
//       }).addTo(mapInstance.current);

//       mapInstance.current.fitBounds(routeLayer.current.getBounds(), { padding: [20, 20] });
//     }
//   }, [routeCoordinates]);

//   return <div ref={mapRef} className="w-full h-full rounded-lg shadow-md" />;
// };

// export default Map;




'use client';

import React, { useEffect, useRef, useState } from 'react';
import { loadLeaflet, L_Instance } from '@/utils/leaflet'; // Custom utility for Leaflet
import { getRouteFromStops } from '@/utils/route'; // Custom function to get route from stops

const Map = ({ locations }) => {
  const mapRef = useRef(null); // Reference for the map container
  const mapInstance = useRef(null); // Reference for the map instance
  const markersLayer = useRef(null); // Reference for marker layer
  const routeLayer = useRef(null); // Reference for route layer
  const [isMapLoaded, setIsMapLoaded] = useState(false); // State to check if Leaflet is loaded
  const [routeCoordinates, setRouteCoordinates] = useState([]); // State to store route coordinates

  // Effect to load Leaflet.js when the component mounts
  useEffect(() => {
    loadLeaflet(setIsMapLoaded);

    return () => {
      // Cleanup the map instance when component unmounts
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Effect to initialize the map
  useEffect(() => {
    if (isMapLoaded && mapRef.current && !mapInstance.current) {
      mapInstance.current = L_Instance.map(mapRef.current).setView([-1.092, 36.982], 12);

      L_Instance.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance.current);

      markersLayer.current = L_Instance.layerGroup().addTo(mapInstance.current);
    }
  }, [isMapLoaded]);

  // Effect to update markers and fetch routes when locations change
  useEffect(() => {
    if (!mapInstance.current || !locations || locations.length === 0) return;

    // Clear old markers if locations change
    markersLayer.current.clearLayers();

    // Add new markers for each location with bg-purple-600 color
    locations.forEach((stop, index) => {
      if (typeof stop?.latitude === 'number' && typeof stop?.longitude === 'number') {
        const stopIcon = L_Instance.divIcon({
          html: `<div class="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-md">
            ${index + 1}
          </div>`,
          className: 'custom-stop-marker',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        L_Instance.marker([stop.latitude, stop.longitude], { icon: stopIcon })
          .bindPopup(stop.location_name || `Stop ${index + 1}`)
          .addTo(markersLayer.current);
      }
    });

    // Fit map to the bounds of the newly added markers
    const validStops = locations.filter(
      stop => typeof stop?.latitude === 'number' && typeof stop?.longitude === 'number'
    );
    if (validStops.length > 0) {
      const bounds = L_Instance.latLngBounds(validStops.map(stop => [stop.latitude, stop.longitude]));
      mapInstance.current.fitBounds(bounds, { padding: [20, 20] });
    }

    // Fetch route coordinates if needed
    getRouteFromStops(locations, setRouteCoordinates);
  }, [locations]);

  // Effect to draw the route once coordinates are updated
  useEffect(() => {
    if (!mapInstance.current || routeCoordinates.length === 0) return;

    // Remove previous route if exists
    if (routeLayer.current) {
      mapInstance.current.removeLayer(routeLayer.current);
    }

    // Add new route with bg-purple-600 color
    routeLayer.current = L_Instance.polyline(routeCoordinates, {
      color: '#8B5CF6', // Purple color for the path
      weight: 4,
      opacity: 0.8
    }).addTo(mapInstance.current);

    // Adjust map view to fit the new route
    mapInstance.current.fitBounds(routeLayer.current.getBounds(), { padding: [20, 20] });
  }, [routeCoordinates]);

  return (
    <div ref={mapRef} className="w-full h-full rounded-lg shadow-md" style={{ height: '500px' }} />
  );
};

export default Map;

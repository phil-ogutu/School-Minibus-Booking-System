'use client'

import { useEffect, useRef, useState } from 'react'
// import L from 'leaflet'
// import 'leaflet/dist/leaflet.css'
import { loadLeaflet, L_Instance } from '@/utils/leaflet';
import { getRouteFromStops } from '@/utils/route';

// Custom SVG-based bus icon
const createBusIcon = (isMoving = true) => L.divIcon({
  html: `
    <div class="relative">
      <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill="${isMoving ? '#EF4444' : '#6B7280'}" d="M5 11C5 9.89543 5.89543 9 7 9H17C18.1046 9 19 9.89543 19 11V18C19 19.1046 18.1046 20 17 20H16C16 21.1046 15.1046 22 14 22H10C8.89543 22 8 21.1046 8 20H7C5.89543 20 5 19.1046 5 18V11Z"/>
        <path fill="#1F2937" d="M17 9H7V6C7 4.89543 7.89543 4 9 4H15C16.1046 4 17 4.89543 17 6V9Z"/>
        <circle fill="#FFFFFF" cx="8.5" cy="18.5" r="1.5"/>
        <circle fill="#FFFFFF" cx="15.5" cy="18.5" r="1.5"/>
        ${isMoving ? '<animateTransform attributeName="transform" type="translate" values="0 0; 0 -2; 0 0" dur="1s" repeatCount="indefinite"/>' : ''}
      </svg>
      ${isMoving ? '<div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>' : ''}
    </div>
  `,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

export default function MapRenderer({
  currentLocation,
  locations,
  pickupLocation,
  dropoffLocation,
  checkpoints,
  isMoving = true
}) {
    const mapRef = useRef(null)
    const mapInstance = useRef(null);
    const markersLayer = useRef(null);
    const routeLayer = useRef(null);
    const markersRef = useRef({
        bus: null,
        pickup: null,
        dropoff: null,
        checkpoints: []
    })
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [routeCoordinates, setRouteCoordinates] = useState([]);

    // Load Leaflet
    useEffect(() => {
        if (typeof window !== 'undefined') {
            loadLeaflet(setIsMapLoaded);
        }

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [isMapLoaded]);

    // Initialize map once
    useEffect(() => {
        if (isMapLoaded && mapRef.current && !mapInstance.current) {
          mapInstance.current = L_Instance.map(mapRef.current).setView([-1.092, 36.982], 12);
    
          L_Instance.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(mapInstance.current);
    
          markersLayer.current = L_Instance.layerGroup().addTo(mapInstance.current);
        }
    }, [isMapLoaded]);

    // Update markers & fetch route when locations change
    useEffect(() => {
        if (!mapInstance.current || !locations || locations.length === 0) return;
    
        // Clear old markers
        markersLayer.current.clearLayers();
    
        // Add new markers
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
    
        // Fit map to new markers
        const validStops = locations.filter(
          stop => typeof stop?.latitude === 'number' && typeof stop?.longitude === 'number'
        );
        if (validStops.length > 0) {
          const bounds = L_Instance.latLngBounds(validStops.map(stop => [stop.latitude, stop.longitude]));
          mapInstance.current.fitBounds(bounds, { padding: [20, 20] });
        }
    
        // Fetch route for new locations
        getRouteFromStops(locations, setRouteCoordinates);
    }, [locations]);

    // Draw route when coordinates update
    useEffect(() => {
        if (!mapInstance.current) return;

        // Remove previous route if exists
        if (routeLayer.current) {
            mapInstance.current.removeLayer(routeLayer.current);
        }

        if (routeCoordinates.length > 0) {
            routeLayer.current = L_Instance.polyline(routeCoordinates, {
            color: '#8B5CF6',
            weight: 4,
            opacity: 0.8
            }).addTo(mapInstance.current);

            mapInstance.current.fitBounds(routeLayer.current.getBounds(), { padding: [20, 20] });
        }
    }, [routeCoordinates]);

    // Update bus location
    useEffect(() => {
        if (!mapRef.current || !currentLocation) return

        const { latitude, longitude } = currentLocation
        const newLatLng = L.latLng(latitude, longitude)

        if (!markersRef.current.bus) {
            markersRef.current.bus = L.marker(newLatLng, {
                icon: createBusIcon(isMoving),
                zIndexOffset: 1000
            }).addTo(mapRef.current)
                .bindPopup('Current Bus Location')
        } else {
            markersRef.current.bus.setLatLng(newLatLng)
            markersRef.current.bus.setIcon(createBusIcon(isMoving))
        }

        mapRef.current.setView(newLatLng, 15, { animate: true, duration: 1 })
    }, [currentLocation, isMoving])

// Update checkpoint markers
//   useEffect(() => {
//     if (!mapRef.current || !checkpoints?.length) return

//     // Clear existing checkpoints
//     markersRef.current.checkpoints.forEach(marker => marker.remove())
//     markersRef.current.checkpoints = []

//     // Add new checkpoints
//     checkpoints.forEach((stop, index) => {
//       if (stop.latitude && stop.longitude) {
//         const checkpointIcon = createCustomMarker('#7C3AED', index + 1)
//         const marker = L.marker([stop.latitude, stop.longitude], { icon: checkpointIcon })
//           .addTo(mapRef.current)
//           .bindPopup(`Stop ${index + 1}: ${stop.location_name}`)
        
//         markersRef.current.checkpoints.push(marker)
//       }
//     })
//   }, [checkpoints])

    return <div ref={mapRef} className="w-full h-full rounded-lg shadow-md" />;
};
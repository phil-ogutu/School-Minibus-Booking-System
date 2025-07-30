// // components/LiveTracking/Shared/MapRenderer.tsx
// // src/Shared/MapRenderer.jsx
// // components/LiveTracking/Shared/MapRenderer.jsx
// 'use client'

// import { useEffect, useRef } from 'react'
// import L from 'leaflet'
// import 'leaflet/dist/leaflet.css'

// // Custom SVG-based bus icon
// const createBusIcon = (isMoving = true) => L.divIcon({
//   html: `
//     <div class="relative">
//       <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//         <path fill="${isMoving ? '#EF4444' : '#6B7280'}" d="M5 11C5 9.89543 5.89543 9 7 9H17C18.1046 9 19 9.89543 19 11V18C19 19.1046 18.1046 20 17 20H16C16 21.1046 15.1046 22 14 22H10C8.89543 22 8 21.1046 8 20H7C5.89543 20 5 19.1046 5 18V11Z"/>
//         <path fill="#1F2937" d="M17 9H7V6C7 4.89543 7.89543 4 9 4H15C16.1046 4 17 4.89543 17 6V9Z"/>
//         <circle fill="#FFFFFF" cx="8.5" cy="18.5" r="1.5"/>
//         <circle fill="#FFFFFF" cx="15.5" cy="18.5" r="1.5"/>
//         ${isMoving ? '<animateTransform attributeName="transform" type="translate" values="0 0; 0 -2; 0 0" dur="1s" repeatCount="indefinite"/>' : ''}
//       </svg>
//       ${isMoving ? '<div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>' : ''}
//     </div>
//   `,
//   className: '',
//   iconSize: [32, 32],
//   iconAnchor: [16, 32]
// })

// // Custom marker creator function
// const createCustomMarker = (color, label = '', iconClass = '') => L.divIcon({
//   html: `
//     <div class="relative flex items-center justify-center">
//       <svg width="28" height="28" viewBox="0 0 24 24" class="${iconClass}">
//         <path fill="${color}" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
//         <text x="12" y="16" font-size="10" font-weight="bold" text-anchor="middle" fill="white">${label}</text>
//       </svg>
//     </div>
//   `,
//   className: '',
//   iconSize: [28, 28],
//   iconAnchor: [14, 28]
// })

// export default function MapRenderer({
//   currentLocation,
//   routeCoordinates,
//   pickupLocation,
//   dropoffLocation,
//   checkpoints,
//   isMoving = true
// }) {
//   const mapRef = useRef(null)
//   const markersRef = useRef({
//     bus: null,
//     pickup: null,
//     dropoff: null,
//     checkpoints: []
//   })

//   // Initialize map
//   useEffect(() => {
//     if (!mapRef.current) {
//       mapRef.current = L.map('tracking-map', {
//         zoomControl: true,
//         preferCanvas: true // Better for dynamic markers
//       }).setView([51.505, -0.09], 13)

//       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '© OpenStreetMap contributors'
//       }).addTo(mapRef.current)
//     }

//     return () => {
//       if (mapRef.current) {
//         mapRef.current.remove()
//         mapRef.current = null
//       }
//     }
//   }, [])

//   // Update bus location
//   useEffect(() => {
//     if (!mapRef.current || !currentLocation) return

//     const { latitude, longitude } = currentLocation
//     const newLatLng = L.latLng(latitude, longitude)

//     if (!markersRef.current.bus) {
//       markersRef.current.bus = L.marker(newLatLng, {
//         icon: createBusIcon(isMoving),
//         zIndexOffset: 1000
//       }).addTo(mapRef.current)
//         .bindPopup('Current Bus Location')
//     } else {
//       markersRef.current.bus.setLatLng(newLatLng)
//       markersRef.current.bus.setIcon(createBusIcon(isMoving))
//     }

//     mapRef.current.setView(newLatLng, 15, { animate: true, duration: 1 })
//   }, [currentLocation, isMoving])

//   // Draw route
//   useEffect(() => {
//     if (!mapRef.current || !routeCoordinates?.length || routeCoordinates.length === 0) return

//     const latLngs = routeCoordinates.map(coord => L.latLng(coord.lat, coord.lng))
//     const polyline = L.polyline(latLngs, { 
//       color: '#3b82f6',
//       weight: 4,
//       opacity: 0.7,
//       dashArray: '5, 5'
//     }).addTo(mapRef.current)

//     // Fit bounds with padding if not following bus
//     if (!currentLocation) {
//       mapRef.current.fitBounds(polyline.getBounds(), { padding: [50, 50] })
//     }

//     return () => polyline.remove()
//   }, [routeCoordinates, currentLocation])

//   // Update pickup and dropoff markers
//   useEffect(() => {
//     if (!mapRef.current) return

//     // Pickup marker
//     if (pickupLocation) {
//       const latLng = L.latLng(pickupLocation.lat, pickupLocation.lng)
//       const pickupIcon = createCustomMarker('#F59E0B', 'P', 'animate-pulse')

//       if (!markersRef.current.pickup) {
//         markersRef.current.pickup = L.marker(latLng, { icon: pickupIcon })
//           .addTo(mapRef.current)
//           .bindPopup('Pickup Location')
//       } else {
//         markersRef.current.pickup.setLatLng(latLng)
//       }
//     }

//     // Dropoff marker
//     if (dropoffLocation) {
//       const latLng = L.latLng(dropoffLocation.lat, dropoffLocation.lng)
//       const dropoffIcon = createCustomMarker('#10B981', 'D', 'shadow-lg')

//       if (!markersRef.current.dropoff) {
//         markersRef.current.dropoff = L.marker(latLng, { icon: dropoffIcon })
//           .addTo(mapRef.current)
//           .bindPopup('Dropoff Location')
//       } else {
//         markersRef.current.dropoff.setLatLng(latLng)
//       }
//     }
//   }, [pickupLocation, dropoffLocation])

//   // Update checkpoint markers
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

//   return <div id="tracking-map" className="w-full h-full rounded-lg z-0" />
// }

'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

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
})

const createCustomMarker = (color, label = '', iconClass = '') => L.divIcon({
  html: `
    <div class="relative flex items-center justify-center">
      <svg width="28" height="28" viewBox="0 0 24 24" class="${iconClass}">
        <path fill="${color}" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        <text x="12" y="16" font-size="10" font-weight="bold" text-anchor="middle" fill="white">${label}</text>
      </svg>
    </div>
  `,
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 28]
})

export default function MapRenderer({
  currentLocation,
  routeCoordinates,
  pickupLocation,
  dropoffLocation,
  checkpoints,
  isMoving = true
}) {
  const mapRef = useRef(null)
  const markersRef = useRef({
    bus: null,
    pickup: null,
    dropoff: null,
    checkpoints: []
  })

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('tracking-map', {
        zoomControl: true,
        preferCanvas: true // Better for dynamic markers
      }).setView([51.505, -0.09], 13)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current)
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // Update bus location
  useEffect(() => {
    if (!mapRef.current || !currentLocation) return

    const { latitude, longitude } = currentLocation
    const newLatLng = L.latLng(latitude, longitude)

    // If there's no bus marker, create it
    if (!markersRef.current.bus) {
      markersRef.current.bus = L.marker(newLatLng, {
        icon: createBusIcon(isMoving),
        zIndexOffset: 1000
      }).addTo(mapRef.current)
        .bindPopup('Current Bus Location')
    } else {
      // If the bus marker already exists, update it
      markersRef.current.bus.setLatLng(newLatLng)
      markersRef.current.bus.setIcon(createBusIcon(isMoving))
    }

    // Re-center the map on the new bus location
    mapRef.current.setView(newLatLng, 15, { animate: true, duration: 1 })
  }, [currentLocation, isMoving]) // Re-run whenever currentLocation or isMoving changes

  // Draw route
  useEffect(() => {
    if (!mapRef.current || !routeCoordinates?.length || routeCoordinates.length === 0) return

    const latLngs = routeCoordinates.map(coord => L.latLng(coord.lat, coord.lng))
    const polyline = L.polyline(latLngs, { 
      color: '#3b82f6',
      weight: 4,
      opacity: 0.7,
      dashArray: '5, 5'
    }).addTo(mapRef.current)

    // Fit bounds with padding if not following bus
    if (!currentLocation) {
      mapRef.current.fitBounds(polyline.getBounds(), { padding: [50, 50] })
    }

    return () => polyline.remove()
  }, [routeCoordinates, currentLocation])

  // Update pickup and dropoff markers
  useEffect(() => {
    if (!mapRef.current) return

    // Pickup marker
    if (pickupLocation) {
      const latLng = L.latLng(pickupLocation.lat, pickupLocation.lng)
      const pickupIcon = createCustomMarker('#F59E0B', 'P', 'animate-pulse')

      if (!markersRef.current.pickup) {
        markersRef.current.pickup = L.marker(latLng, { icon: pickupIcon })
          .addTo(mapRef.current)
          .bindPopup('Pickup Location')
      } else {
        markersRef.current.pickup.setLatLng(latLng)
      }
    }

    // Dropoff marker
    if (dropoffLocation) {
      const latLng = L.latLng(dropoffLocation.lat, dropoffLocation.lng)
      const dropoffIcon = createCustomMarker('#10B981', 'D', 'shadow-lg')

      if (!markersRef.current.dropoff) {
        markersRef.current.dropoff = L.marker(latLng, { icon: dropoffIcon })
          .addTo(mapRef.current)
          .bindPopup('Dropoff Location')
      } else {
        markersRef.current.dropoff.setLatLng(latLng)
      }
    }
  }, [pickupLocation, dropoffLocation])

  // Update checkpoint markers
  useEffect(() => {
    if (!mapRef.current || !checkpoints?.length) return

    // Clear existing checkpoints
    markersRef.current.checkpoints.forEach(marker => marker.remove())
    markersRef.current.checkpoints = []

    // Add new checkpoints
    checkpoints.forEach((stop, index) => {
      if (stop.latitude && stop.longitude) {
        const checkpointIcon = createCustomMarker('#7C3AED', index + 1)
        const marker = L.marker([stop.latitude, stop.longitude], { icon: checkpointIcon })
          .addTo(mapRef.current)
          .bindPopup(`Stop ${index + 1}: ${stop.location_name}`)
        
        markersRef.current.checkpoints.push(marker)
      }
    })
  }, [checkpoints])

  return <div id="tracking-map" className="w-full h-full rounded-lg z-0" />
}

// src/Shared/EtaCalculator.jsx
'use client'

import { useEffect, useState } from 'react'
import { haversineDistance } from '@/utils/distance'

export default function EtaCalculator({ 
  currentLocation, 
  dropoffLocation, 
  routeStops = [] 
}) {
  const [eta, setEta] = useState('Calculating...')
  const [distance, setDistance] = useState('')

  useEffect(() => {
    if (!currentLocation || !dropoffLocation) {
      setEta('Location data missing')
      return
    }

    // Calculate direct distance
    const directDistance = haversineDistance(currentLocation, dropoffLocation)
    setDistance(`${directDistance.toFixed(1)} km`)

    // Calculate ETA (30 km/h average speed + 1 min per stop remaining)
    const stopsRemaining = routeStops.filter(stop => 
      stop.latitude && stop.longitude &&
      haversineDistance(currentLocation, stop) < directDistance
    ).length

    const averageSpeed = 30 // km/h
    const etaHours = directDistance / averageSpeed
    const etaMinutes = Math.round(etaHours * 60) + stopsRemaining
    
    if (etaMinutes < 2) {
      setEta('Arriving now')
    } else if (etaMinutes < 60) {
      setEta(`~${etaMinutes} min`)
    } else {
      const hours = Math.floor(etaMinutes / 60)
      const mins = etaMinutes % 60
      setEta(`~${hours}h ${mins}m`)
    }
  }, [currentLocation, dropoffLocation, routeStops])

  return (
    <div className="flex items-center space-x-4 text-sm">
      <div className="flex items-center">
        <span className="font-medium mr-1">Distance:</span>
        <span>{distance}</span>
      </div>
      <div className="flex items-center">
        <span className="font-medium mr-1">ETA:</span>
        <span className="font-semibold text-blue-600">{eta}</span>
      </div>
    </div>
  )
}
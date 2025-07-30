// components/LiveTracking/hooks/useGeocoding.ts
// src/hooks/useGeocoding.js
import { useState } from 'react'
import { fetchLatLng } from '@/utils/geocode'

export const useGeocoding = () => {
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [geocodingError, setGeocodingError] = useState(null)

  const geocodeLocation = async (locationName) => {
    if (!locationName) return null
    
    setIsGeocoding(true)
    setGeocodingError(null)
    
    try {
      const coords = await fetchLatLng(locationName)
      return coords
    } catch (error) {
      setGeocodingError(`Failed to locate ${locationName}`)
      console.error('Geocoding error:', error)
      return null
    } finally {
      setIsGeocoding(false)
    }
  }

  return {
    geocodeLocation,
    isGeocoding,
    geocodingError
  }
}
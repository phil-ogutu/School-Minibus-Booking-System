// components/LiveTracking/AdminTrackingPanel.tsx
// src/app/adminTrackingPanel/AdminTrackingPanel.jsx
'use client'

import { useState, useEffect, useContext } from 'react'
import { getSocket } from '@/utils/socket'
import MapRenderer from '@/Shared/MapRenderer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useGeocoding } from '@/hooks/useGeocoding'
import { AuthContext } from '@/context/AuthContext'

export default function AdminTrackingPanel() {
  const [activeTrips, setActiveTrips] = useState([])
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [busLocation, setBusLocation] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredTrips, setFilteredTrips] = useState(null)
  const { geocodeLocation } = useGeocoding()
  const { user } = useContext(AuthContext)

  const loadUserDetails = async () => {
    console.log(`Getting user details... =`, user)
    if (!user?.role !== 'admin') return 

    try {
      console.log(`Emitting request to get trips for the admin ... `)
      // socket.emit('admin_request_trips');
      // setIsLoading(false)
    } catch (error) {
      console.error('Trip retrieval failed:', error)
    }
  }

  useEffect(() => {
    loadUserDetails()
  }, [user])

  useEffect(() => {
    const socket = getSocket()

    // loadUserDetails()
    socket.emit('admin_request_trips');

    socket.on('admin_active_trips', (trips) => {
      console.log('admin active trips: ', trips)
      setActiveTrips(trips)
    })

    socket.on('bus_location_update_to_admin', (data) => {
      if (selectedTrip && data.bus_id === selectedTrip.id) {
        setBusLocation(data)
      }
    })

    return () => {
      socket.off('admin_request_trips')
      socket.off('admin_active_trips')
      socket.off('bus_location_update_to_admin')
    }
  }, [selectedTrip])

  const handleTrackTrip = (trip) => {
    setSelectedTrip(trip)
    // Optional. causes error, not all will be found
    // if (trip.routes?.locations) {
    //   trip.routes.locations.forEach(async stop => {
    //     await geocodeLocation(stop.location_name)
    //   })
    // }
  }

  useEffect(() => {
    if (activeTrips) {
      const filterTrips = activeTrips.filter(trip =>
        trip.id.toString().includes(searchTerm) ||
        trip.driver_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredTrips(filterTrips)
    } else { console.log('activetrips not updated, and searchterm not available')}

  }, [activeTrips, searchTerm])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <h2 className="text-xl font-bold">Active Trips</h2>
        
        <Input
          placeholder="Search trips..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <div className="space-y-2 max-h-[70vh] overflow-y-auto">
          {filteredTrips && filteredTrips.map(trip => (
            <div
              key={trip.id}
              className={`p-3 rounded-lg cursor-pointer ${
                selectedTrip?.id === trip.id
                  ? 'bg-blue-100 border border-blue-300'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleTrackTrip(trip)}
            >
              <p className="font-medium">Bus #{trip.id}</p>
              <p className="text-sm">Driver: {trip.driver_name}</p>
              <p className="text-sm">
                Route: {trip.route_start} → {trip.route_end}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-3 space-y-4">
        {selectedTrip ? (
          <>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-medium">
                Tracking Bus #{selectedTrip.id}
              </h3>
              {busLocation && (
                <div className="mt-2 grid grid-cols-3 gap-2">
                  <div>
                    <p className="text-sm text-gray-500">Current Location</p>
                    <p>
                      {busLocation.latitude.toFixed(6)}, {busLocation.longitude.toFixed(6)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Update</p>
                    <p>{new Date(busLocation.timestamp).toLocaleTimeString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Speed</p>
                    <p>{busLocation.speed || '0'} km/h</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-100 rounded-lg overflow-hidden h-[70vh]">
              <MapRenderer
                currentLocation={busLocation}
                routeCoordinates={selectedTrip.routes?.locations || []}
              />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-[70vh] bg-white rounded-lg shadow">
            <p className="text-gray-500">Select a trip to begin tracking</p>
          </div>
        )}
      </div>
    </div>
  )
}
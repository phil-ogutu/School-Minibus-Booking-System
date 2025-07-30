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
import axiosInstance from '@/lib/api'

export default function AdminTrackingPanel() {
  const [activeTrips, setActiveTrips] = useState([])
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [busLocation, setBusLocation] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredTrips, setFilteredTrips] = useState(null)
  const [routeCoordinates, setRouteCoordinates] = useState([])
  const [driver, setDriver] = useState(null);  
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
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
    console.log('s-drv-', selectedTrip)
    if (!selectedTrip) return;

    const fetchDriverDetails = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/drivers/${selectedTrip.driver_id}`);
        setDriver(response.data); 
      } catch (err) {
        setError("Failed to fetch driver details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDriverDetails();
  }, [selectedTrip]);

  useEffect(() => {
    const socket = getSocket()

    // loadUserDetails()
    socket.emit('admin_request_trips');
    activeTrips && console.log('ACTIVE TRIPS=: ', activeTrips)
    selectedTrip && console.log('SELECTED TRIP-ROUTE LOCATIONS=: ', selectedTrip.routes.locations)
    selectedTrip && socket.emit('admin_track_trip', { bus_id: selectedTrip.id });

    socket.on('admin_active_trips', (trips) => {
      console.log('admin active trips: ', trips)
      setActiveTrips(trips)
    })

    // socket.on('bus_location_update_to_admin', (data) => {
    //   console.log('bus location update to admin: ', data)
    //   if (selectedTrip && data.bus_id === selectedTrip.id) {
    //     setBusLocation(data)
    //   }
    // })

    return () => {
      socket.off('admin_request_trips')
      socket.off('admin_track_trip')
      socket.off('admin_active_trips')
      // socket.off('bus_location_update_to_admin')
    }
  }, [selectedTrip])

  useEffect(() => {
    const socket = getSocket()

    if (selectedTrip) {
      console.log('SELECTED TRIP============: ', selectedTrip?.routes?.locations)
      socket.on('bus_location_update_to_admin', (data) => {
        console.log('bus location update to admin: ', data)
        if (selectedTrip && data.bus_id === selectedTrip.id) {
          const { latitude, longitude } = data
          latitude && setBusLocation(data)
        }
      })
    }

    return () => {
      socket.off('bus_location_update_to_admin')
    }
  }, [selectedTrip])

  const handleTrackTrip = (trip) => {
    console.log('Selected trip: ', trip)
    setSelectedTrip(trip)
    setBusLocation(null) // clear the map

    const stopsCoords = trip?.routes?.locations?.map((stop) => ({
      lat: stop.latitude,
      lng: stop.longitude,
      address: stop.location_name
    })) || [];

    // optionally find out if start, end, pickup, or dropoff existed in stopsCoords and replace or use stopsCoords'

    console.log('Stop coords: ', stopsCoords)
    setRouteCoordinates(stopsCoords)
  }

  if (busLocation) {console.log('BUS LOCATION STATE: ', busLocation)}
  const isMoving = busLocation?.isMoving ?? false;

  useEffect(() => {
    if (activeTrips) {
      const filterTrips = activeTrips.filter(trip =>
        trip.id.toString().includes(searchTerm) || trip.driver_id.toString().includes(searchTerm)
        // || trip.driver_name.toLowerCase().includes(searchTerm.toLowerCase())
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
              <p className="text-sm">Driver: {trip.driver_id}</p>
              <p className="text-sm">
                Route: {trip.routes?.start} → {trip.routes?.end}
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
                      {busLocation.latitude.toFixed(6)}, {busLocation.longitude.toFixed(6)} (<span className='text-xs'>next stop <span className='text-purple-500 font-bold'>{busLocation.location_name}</span></span>)
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Update</p>
                    <p>
                      {new Date(busLocation.timestamp).toLocaleString("en-KE", {
                        timeZone: "Africa/Nairobi",
                        weekday: "long", // "long" to get full weekday name
                        year: "numeric",
                        month: "long", // "long" gives full month name
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Speed</p>
                    <p>{busLocation.speed || '0'} km/h</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-100 rounded-lg overflow-hidden h-[70vh]">
              {busLocation ? (
                <MapRenderer
                  currentLocation={busLocation}
                  routeCoordinates={routeCoordinates || []}
                  isMoving={isMoving}
                />
                // <div>Map</div>
              ) :
              (
              <> 
                <div className="bg-amber-300 pl-2">The current trip selected is not being tracked. Contact driver.</div>

                <div className="p-4 mr-auto ml-auto">
                  {loading && <p>Loading driver details...</p>}
                  {error && <p className="text-red-500">{error}</p>}
                  
                  {driver && (
                    <div>
                      <h2 className='font-bold'>Driver Details</h2>
                      <p>Driver ID: {driver.id}</p>
                      <p>Name: {driver.driver_name}</p>
                      <p>Bio: {driver.bio || 'N/A'}</p>
                    </div>
                  )}
                </div>
              </>
              )
              }
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
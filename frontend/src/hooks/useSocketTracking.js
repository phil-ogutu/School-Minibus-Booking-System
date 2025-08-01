// src/hooks/useSocketTracking.js
import { useEffect, useState } from 'react'
import { getSocket } from '@/utils/socket'
import { haversineDistance } from '@/utils/distance'

export const useSocketTracking = (user, activeBooking) => {
  const [busLocation, setBusLocation] = useState(null)
  const [checkpointData, setCheckpointData] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const [remainingStops, setRemainingStops] = useState([])
  const [estimatedArrival, setEstimatedArrival] = useState(null)

  useEffect(() => {
    console.log('user',user,activeBooking);
    if (!user || !activeBooking) return

    const socket = getSocket()
    console.log('socket',socket)

    const handleConnect = () => setConnectionStatus('connected')
    const handleDisconnect = () => setConnectionStatus('disconnected')

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)

    socket.on('bus_location_update_to_parent', (data) => {
      console.log('bus_location_update_to_parent',data,activeBooking)
      setBusLocation(data)
    })

    socket.on('bus_checkpoint_reached', (data) => {
      console.log('checkpoint reached: ', data)
      if (data.bus_id === activeBooking.bus_id) {
        setCheckpointData(data)
        updateRemainingStops(data)
      }
    })

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
      socket.off('bus_location_update_to_parent')
      socket.off('bus_checkpoint_reached')
    }
  }, [user, activeBooking])

  const calculateEta = (locationData) => {
    if (!activeBooking?.dropoff_coords) return
    
    const distance = haversineDistance(
      { lat: locationData.latitude, lng: locationData.longitude },
      activeBooking.dropoff_coords
    )
    
    const etaMinutes = Math.round((distance / 30) * 60)
    setEstimatedArrival(etaMinutes)
  }

  const updateRemainingStops = (checkpointData) => {
    if (!checkpointData.checkpoints) return
    
    const remaining = checkpointData.checkpoints.filter(stop => {
      return !checkpointData.reached_checkpoints?.includes(stop.id)
    })
    
    setRemainingStops(remaining)
  }

  return {
    busLocation,
    checkpointData,
    connectionStatus,
    estimatedArrival,
    remainingStops
  }
}
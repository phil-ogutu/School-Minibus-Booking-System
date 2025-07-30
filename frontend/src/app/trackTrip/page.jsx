// 'use client'

// import { useEffect, useState, useContext } from 'react';
// import { getSocket } from '@/utils/socket';
// import { AuthContext } from '@/context/AuthContext';
// import { fetchLatLng } from '@/utils/geocode'; // Assuming you have this utility for lat/lng fetching
// // import LiveMap from '@/components/LiveMap';
// import MapComponent from '@/components/Map';
// import { data } from 'autoprefixer';


// export default function LiveMapViewer() {
//   const { user, loading } = useContext(AuthContext);
//   const [driverLocation, setDriverLocation] = useState(null); // for checkpoint info
//   const [busLocation, setBusLocation] = useState(null); // For real-time updates
//   const [route, setRoute] = useState([]);
//   const [childDropoff, setChildDropoff] = useState(null);
//   const [currentBooking, setCurrentBooking] = useState()
  
//   // Parent's current trip (`user.bookings` gives us the user's bookings))
//   useEffect(() => {
//     if (user && user.bookings && !loading) {  // Ensure user is not null and the user data is loaded
//       // console.log('USER; ', user.bookings[0].dropoff)
//       const currentBooking = user.bookings.filter(booking => booking.parent_id === user.id);
//       setCurrentBooking(currentBooking);
//       console.log('USER b: ', currentBooking)
//     }
//   }, [user, loading]); // Dependency on `user` and `loading` ensures it runs after user data is loaded
  

//   useEffect(() => {
//     const socket = getSocket();

//     socket.on('connect', () => {
//       console.log('Connected to socket server - trackTrip page');
//     });

//     // socket.on('error', (data) => {
//     //   console.log('Error - ', data);
//     // });

//     // Listening for bus location updates
//     socket.on('bus_location_update_to_parent', (data) => {
//       console.log('Received bus location update: ', data);

//       const {
//           driver_id,
//           driver_phone,
//           bus_id,
//           latitude,
//           longitude,
//           child_name,
//           dropoff_location, // If we had lat and long, we would calculate distance and time left (do this from frontend)
//           route_start,
//           route_end,
//           trip_stops // location objects
//       } = data;

//       alert(`Bus heading to: ${dropoff_location}: is now at latitude: ${latitude}, longitude: ${longitude}`);

//       setBusLocation(data);
//     });

//     // bus_checkpoint_reached // bus_location_update // location_broadcast
//     socket.on('bus_checkpoint_reached////', (data) => {
//       console.log('Live update:', data);

//       const {
//           driver_id,
//           driver_phone,
//           bus_id,
//           checkpoint,
//           latitude,
//           longitude,
//           estimated_time_to_next_checkpoint,
//           checkpoints
//       } = data;

//       // Alert with the checkpoint name and latitude
//       alert(`Bus has reached the checkpoint: ${checkpoint} at latitude: ${latitude}, longitude: ${longitude}`);

//       // If you want to display all the extracted info in the console
//       console.log('Driver ID:', driver_id);
//       console.log('Driver Phone:', driver_phone);
//       console.log('Bus ID:', bus_id);
//       console.log('Checkpoint Name:', checkpoint);
//       console.log('Checkpoint Latitude:', latitude);
//       console.log('Checkpoint Longitude:', longitude);

//       // If an estimated time to the next checkpoint is available, show it
//       if (estimated_time_to_next_checkpoint !== null) {
//           console.log('Estimated Time to Next Checkpoint:', estimated_time_to_next_checkpoint, 'seconds');
//       } else {
//           console.log('Next checkpoint ETA not available');
//       }

//       // Update the UI with this data, e.g., driver's location on a map
//       // setDriverLocation(latitude, longitude); 
//       setDriverLocation(data); 

//       // List of all remaining checkpoints
//       console.log('Remaining Checkpoints:', checkpoints);
      
//       // Additional code to update the UI could be placed here, like updating a tracking interface
//     });

//     return () => {
//       socket.off('bus_location_update_to_parent');
//       socket.off('bus_checkpoint_reached');
//     };
//   }, []);

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-md space-y-6">
//       <h2>Live Trip Tracker</h2>

//       {/* Bus Location Information */}
//       {busLocation && (
//         <div className="space-y-4">
//           <p className="text-lg text-gray-700">
//             <span className="font-semibold">Driver ID:</span> {busLocation.driver_id}
//           </p>
//           <p className="text-lg text-gray-700">
//             <span className="font-semibold">Driver Phone:</span> {busLocation.driver_phone}
//           </p>
//           <p className="text-lg text-gray-700">
//             <span className="font-semibold">Bus ID:</span> {busLocation.bus_id}
//           </p>
//           <p className="text-lg text-gray-700">
//             <span className="font-semibold">Location:</span> {busLocation.latitude}, {busLocation.longitude}
//           </p>
//           <p className="text-lg text-gray-700">
//             <span className="font-semibold">Child's Name:</span> {busLocation.child_name}
//           </p>
//           <p className="text-lg text-gray-700">
//             <span className="font-semibold">Child's Dropoff Location:</span> {busLocation.dropoff_location}
//           </p>
//           <p className="text-lg text-gray-700">
//             <span className="font-semibold">Route Start:</span> {busLocation.route_start}
//           </p>
//           <p className="text-lg text-gray-700">
//             <span className="font-semibold">Route End:</span> {busLocation.route_end}
//           </p>
//           <div>Remaining Stops: {busLocation.trip_stops.map(stop => (
//               <div key={stop.id}>{stop.location_name}</div>
//             ))}</div>
//         </div>
//       )}
      
//       {/* First check if both driverLocation and childDropoff are available */}
//       {driverLocation ? (
//         <> 
//           <div className=''>
//             {/* <p>Driver ID: {driverLocation.driver_id}</p> */}
//             <p>Driver Phone: {driverLocation.driver_phone}</p>
//             {/* <p>Bus ID: {driverLocation.bus_id}</p> */}
//             <p>Checkpoint Name: {driverLocation.checkpoint}</p>
//             <div>
//               {driverLocation.estimated_time_to_next_checkpoint !== null && (
//                 <p>
//                   Estimated time to next checkpoint:{" "}
//                   {Math.floor(driverLocation.estimated_time_to_next_checkpoint / 60)} min{" "}
//                   {Math.floor(driverLocation.estimated_time_to_next_checkpoint % 60)} sec
//                 </p>
//               )}
//             </div>
//             <div>
//               {currentBooking && currentBooking[0].dropoff && (
//                 <p>Child's Dropoff Location: {currentBooking[0].dropoff}</p>
//               )}
//             </div>
//             {/* <p>Child's Dropoff Location: {childDropoff}</p> */}
//             <div>Remaining Stops: {driverLocation.checkpoints.map(stop => (
//               <div key={stop.id}>{stop.location_name}</div>
//             ))}</div>
//             {/* <div>Remaining Stops: {route.map(stop => (
//               <div key={stop.id}>{stop.location_name}</div>
//             ))}</div> */}
//           </div>

//           <div>
//             {/* Your map component here */}
//             {/* <MapComponent locations={driverLocation.checkpoints} /> */}
//             {/* Map should update based on driver's live location */}
//           </div>
//         </>
//       ) : (
//         <p>Waiting for data...</p> // Message while waiting for both driverLocation and childDropoff
//       )}
//     </div>
//   );

// };


// components/LiveTracking/ParentTrackingView.tsx
// src/app/trackTrip/page.jsx
'use client'

import { useEffect, useState, useContext } from 'react'
import { AuthContext } from '@/context/AuthContext'
import MapRenderer from '@/Shared/MapRenderer'
import CheckpointAlert from '@/Shared/CheckpointAlert'
import EtaCalculator from '@/Shared/EtaCalculator'
import { useSocketTracking } from '@/hooks/useSocketTracking'
import { useGeocoding } from '@/hooks/useGeocoding'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { calcLength } from 'framer-motion'
import { calculateTimeToDropoff } from '@/utils/timetodropoff'

export default function ParentTrackingView() {
  const { user } = useContext(AuthContext)
  const [activeBooking, setActiveBooking] = useState(null)
  const [routeCoordinates, setRouteCoordinates] = useState([])
  const [currentLocation, setCurrentLocation] = useState(null)
  const [checkpoint, setCheckpoint] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeBookingPickupCoords, setActiveBookingPickupCoords] = useState(null)
  const [activeBookingDropoffCoords, setActiveBookingDropoffCoords] = useState(null)
  const [bookingDropOffAddress, setBookingDropOffAddress] = useState(null)

  const { geocodeLocation } = useGeocoding()
  const {
    busLocation,
    checkpointData,
    connectionStatus,
    estimatedArrival,
    remainingStops
  } = useSocketTracking(user, activeBooking)

  const isMoving = busLocation?.isMoving ?? false;

  useEffect(() => {
    const loadBookingData = async () => {
      if (!user?.bookings?.length) return // Optionally alert user to add booking
      
      const booking = user.bookings.find(b => b.status === 'active') || user.bookings[0]
      setActiveBooking(booking)

      try {
        console.log(`Pickup and DropOff: ${booking.pickup} ${booking.dropoff}`)
        console.log('Bus Route: ', booking?.bus?.routes) // One bus one route
        // booking pickup and dropoff
        const pickupCoords = await geocodeLocation(booking.pickup)
        const dropoffCoords = await geocodeLocation(booking.dropoff)
        if (pickupCoords) {
          setActiveBookingPickupCoords({ lat: pickupCoords.lat, lng: pickupCoords.lng })
        }
        if (dropoffCoords) {
          setActiveBookingDropoffCoords({ lat: dropoffCoords.lat, lng: dropoffCoords.lng })
          setBookingDropOffAddress(dropoffCoords.address)
        }
        // Route start and end (MapRenderer will automaticall spot all our coordinates though)
        const routeStartCoords = await geocodeLocation(booking.bus.routes.start)
        const routeEndCoords = await geocodeLocation(booking.bus.routes.end)

        const { lat: pickupLat, lng: pickupLong, address: pickupAddress } = pickupCoords
        const { lat: dropoffLat, lng: dropoffLong, address: dropoffAddress } = dropoffCoords
        // console.log(`Pickup and DropOff Coords: ${pickupLat} ${pickupLong} (${pickupAddress}) dropoff: ${dropoffLat} ${dropoffLong} (${dropoffAddress})`)
        const { lat: startLat, lng: startLong, address: startAddress } = routeStartCoords
        const { lat: endLat, lng: endLong, address: endAddress } = routeEndCoords
        console.log(`Route Start and End Coords: ${startLat} ${startLong} (${startAddress}) route End: ${endLat} ${endLong} (${endAddress})`)
        
        const stopsCoords = booking?.bus?.routes?.locations?.map((stop) => ({
          lat: stop.latitude,
          lng: stop.longitude,
          address: stop.location_name
        })) || [];

        // find out if start, end, pickup, or dropoff existed in stopsCoords and replace or use stopsCoords'
        const fullRoute = [
          { lat: startLat, lng: startLong, address: startAddress }, // Route start
          { lat: pickupLat, lng: pickupLong, address: pickupAddress }, // Pickup start
          ...stopsCoords,
          { lat: dropoffLat, lng: dropoffLong, address: dropoffAddress }, // Pickup end
          { lat: endLat, lng: endLong, address: endAddress } // Route end
        ]

        console.log('Stop coords: ', fullRoute)
        setRouteCoordinates(stopsCoords) // lets trust db locations for now
        // setRouteCoordinates(stopsCoords)
        if (booking?.bus?.routes?.locations?.stop) { // remove .stop to execute.
          const stopsCoords = await Promise.all(
            booking.bus.routes.locations.map(stop => geocodeLocation(stop.location_name)) // some coordinates will be null, allow falling back to those from the backend table
          )
          console.log(stopsCoords)
          setRouteCoordinates(stopsCoords)
        }

        setIsLoading(false)
      } catch (error) {
        console.error('Geocoding failed:', error)
      }
    }

    loadBookingData()
  }, [user])

  useEffect(() => {
    if (checkpointData && activeBookingDropoffCoords) {
      const checkpoint = { lat: checkpointData.latitude, lng: checkpointData.longitude, speed: checkpointData.speed };
      const { distanceMeters, timeSeconds, minutes, seconds } = calculateTimeToDropoff(checkpoint, activeBookingDropoffCoords);
      if (distanceMeters) {alert(`Distance to dropoff (${bookingDropOffAddress}) from the checkpoint (${checkpointData.checkpoint}) is ${distanceMeters.toFixed(2)} meters`)} else if
      (minutes >= 0 && minutes < 30) {alert(`Time to dropoff: ${minutes} minutes and ${seconds} seconds`)}
    }
  }, [checkpointData, activeBookingDropoffCoords])

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 h-[calc(100vh-64px)]">
      <div className="bg-white rounded-lg shadow p-4 space-y-4 overflow-y-auto">
        <h2 className="text-xl font-bold">Trip Tracking</h2>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className={`w-3 h-3 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span>{connectionStatus === 'connected' ? 'Live' : 'Disconnected'}</span>
          </div>
          
          {busLocation && (
            <div className="space-y-1">
              <p className="font-medium">Child: {activeBooking.child_name}</p>
              <p>Bus: {busLocation.bus_id}</p>
              <p>Driver: {busLocation.driver_phone}</p>
              <EtaCalculator 
                currentLocation={busLocation}
                dropoffLocation={activeBooking.dropoff_coords}
                routeStops={remainingStops}
              />
            </div>
          )}
        </div>

        {checkpointData && (
          <CheckpointAlert 
            checkpoint={checkpointData}
            onDismiss={() => setCheckpoint(null)}
          />
        )}

        <div className="mt-4">
          <h3 className="font-medium mb-2">Route Stops</h3>
          <div className="space-y-1">
            {remainingStops?.map((stop, index) => (
              <div key={index} className="flex items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-2" />
                <span>{stop.location_name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 bg-gray-100 rounded-lg overflow-hidden">
        <MapRenderer
          currentLocation={busLocation}
          routeCoordinates={routeCoordinates}
          pickupLocation={activeBookingPickupCoords || activeBooking.pickup_coords}
          dropoffLocation={activeBookingDropoffCoords || activeBooking.dropoff_coords}
          checkpoints={remainingStops}
          isMoving={isMoving}
        />
      </div>
    </div>
  )
}



// ////
// // current
// "use client"

// import { useEffect, useState, useContext } from 'react';
// import { getSocket } from '@/utils/socket';
// import { AuthContext } from '@/context/AuthContext';
// import { fetchLatLng } from '@/utils/geocode'; // Assuming you have this utility for lat/lng fetching
// // import LiveMap from '@/components/LiveMap';
// import MapComponent from '@/components/Map';
// import { data } from 'autoprefixer';


// export default function LiveMapViewer() {
//   const { user, loading } = useContext(AuthContext);
//   const [driverLocation, setDriverLocation] = useState(null); // for checkpoint info
//   const [busLocation, setBusLocation] = useState(null); // For real-time updates
//   const [route, setRoute] = useState([]);
//   const [childDropoff, setChildDropoff] = useState(null);
//   const [currentBooking, setCurrentBooking] = useState()
  
//   // Parent's current trip (`user.bookings` gives us the user's bookings))
//   useEffect(() => {
//     if (user && user.bookings && !loading) {  // Ensure user is not null and the user data is loaded
//       // console.log('USER; ', user.bookings[0].dropoff)
//       const currentBooking = user.bookings.filter(booking => booking.parent_id === user.id);
//       setCurrentBooking(currentBooking);
//       console.log('USER b: ', currentBooking)
//     }
//   }, [user, loading]); // Dependency on `user` and `loading` ensures it runs after user data is loaded

//   useEffect(() => {
//     const socket = getSocket();

//     socket.on('connect', () => {
//       console.log('Connected to socket server - trackTrip page');
//     });

//     // socket.on('error', (data) => {
//     //   console.log('Error - ', data);
//     // });

//     // Listening for bus location updates
//     socket.on('bus_location_update_to_parent', (data) => {
//       console.log('Received bus location update: ', data);

//       const {
//           driver_id,
//           driver_phone,
//           bus_id,
//           latitude,
//           longitude,
//           booking_parent_id,
//           booking_id,
//           child_name,
//           dropoff_location, // If we had lat and long, we would calculate distance and time left (do this from frontend)
//           route_start,
//           route_end,
//           trip_stops // location objects
//       } = data;

//       if (currentBooking && currentBooking.id === data.booking_id) {
//         setBusLocation(data);
//         alert(`Bus heading to: ${dropoff_location}: is now at latitude: ${latitude}, longitude: ${longitude}`);
//         // Check if dropoff is approaching
//         if (data.dropoff_location === currentBooking.dropoff) {
//           setChildDropoff(data.dropoff_location);
//         }
//       }

//     });

//     // If the user is an admin, they can track all trips
//     if (user && user.role === 'admin') {
//       socket.on('bus_location_update_to_admin', (data) => {
//         console.log('Listening on bus location for admin: ', data);
//         setDriverLocation(data);
//         // Admin could be seeing all trips etc.
//       });
//     }

//     // bus_checkpoint_reached 
//     socket.on('bus_checkpoint_reached', (data) => {
//       console.log('Live update:', data);

//       const {
//           driver_id,
//           driver_phone,
//           bus_id,
//           checkpoint,
//           latitude,
//           longitude,
//           estimated_time_to_next_checkpoint,
//           checkpoints
//       } = data;

//       // Alert with the checkpoint name and latitude
//       alert(`Bus has reached the checkpoint: ${checkpoint} at latitude: ${latitude}, longitude: ${longitude}`);

//       // If an estimated time to the next checkpoint is available, show it
//       if (estimated_time_to_next_checkpoint !== null) {
//           console.log('Estimated Time to Next Checkpoint:', estimated_time_to_next_checkpoint, 'seconds');
//       } else {
//           console.log('Next checkpoint ETA not available');
//       }

//       // Update the UI with this data, e.g., driver's location on a map
//       setDriverLocation(data); 

//       // List of all remaining checkpoints
//       console.log('Remaining Checkpoints:', checkpoints);
      
//       // Additional code to update the UI could be placed here, like updating a tracking interface
//     });

//     return () => {
//       socket.off('bus_location_update_to_parent');
//       socket.off('bus_checkpoint_reached');
//     };
//   }, []);

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-md space-y-6">
//       <h2>Live Trip Tracker</h2>

//       {/* Bus Location Information */}
//       {busLocation && (
//         <div className="space-y-4">
//           <p className="text-lg text-gray-700">
//             <span className="font-semibold">Driver ID:</span> {busLocation.driver_id}
//           </p>
//           <p className="text-lg text-gray-700">
//             <span className="font-semibold">Driver Phone:</span> {busLocation.driver_phone}
//           </p>
//           <p className="text-lg text-gray-700">
//             <span className="font-semibold">Bus ID:</span> {busLocation.bus_id}
//           </p>
//           <p className="text-lg text-gray-700">
//             <span className="font-semibold">Location:</span> {busLocation.latitude}, {busLocation.longitude}
//           </p>
//           <p className="text-lg text-gray-700">
//             <span className="font-semibold">Child's Name:</span> {busLocation.child_name}
//           </p>
//           <p className="text-lg text-gray-700">
//             <span className="font-semibold">Child's Dropoff Location:</span> {busLocation.dropoff_location}
//           </p>
//           <p className="text-lg text-gray-700">
//             <span className="font-semibold">Route Start:</span> {busLocation.route_start}
//           </p>
//           <p className="text-lg text-gray-700">
//             <span className="font-semibold">Route End:</span> {busLocation.route_end}
//           </p>
//           <div>Remaining Stops: {busLocation.trip_stops.map(stop => (
//               <div key={stop.id}>{stop.location_name}</div>
//             ))}</div>
//         </div>
//       )}
      
//       {/* First check if both driverLocation and childDropoff are available */}
//       {driverLocation ? (
//         <> 
//           <div className=''>
//             {/* <p>Driver ID: {driverLocation.driver_id}</p> */}
//             <p>Driver Phone: {driverLocation.driver_phone}</p>
//             {/* <p>Bus ID: {driverLocation.bus_id}</p> */}
//             <p>Checkpoint Name: {driverLocation.checkpoint}</p>
//             <div>
//               {driverLocation.estimated_time_to_next_checkpoint !== null && (
//                 <p>
//                   Estimated time to next checkpoint:{" "}
//                   {Math.floor(driverLocation.estimated_time_to_next_checkpoint / 60)} min{" "}
//                   {Math.floor(driverLocation.estimated_time_to_next_checkpoint % 60)} sec
//                 </p>
//               )}
//             </div>
//             <div>
//               {currentBooking && currentBooking[0].dropoff && (
//                 <p>Child's Dropoff Location: {currentBooking[0].dropoff}</p>
//               )}
//             </div>
//             {/* <p>Child's Dropoff Location: {childDropoff}</p> */}
//             <div>Remaining Stops: {driverLocation.checkpoints.map(stop => (
//               <div key={stop.id}>{stop.location_name}</div>
//             ))}</div>
//             {/* <div>Remaining Stops: {route.map(stop => (
//               <div key={stop.id}>{stop.location_name}</div>
//             ))}</div> */}
//           </div>

//           <div>
//             {/* Your map component here */}
//             {/* <MapComponent locations={driverLocation.checkpoints} /> */}
//             {/* Map should update based on driver's live location */}
//           </div>
//         </>
//       ) : (
//         <p>Waiting for data...</p> // Message while waiting for both driverLocation and childDropoff
//       )}
//     </div>
//   );

// };
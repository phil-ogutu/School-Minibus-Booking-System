'use client'
import React, { useEffect, useRef, useState } from 'react';
import { busIcon, groupIcon, mapPinIcon, playIcon, arrowLocationIcon, flagIcon} from '@/components/ui/icons.js';
import { getRouteFromStops } from '@/utils/route.js';
import Container from '@/components/ui/Container';
import Text from '@/components/ui/Text';
import { useParams, useRouter } from 'next/navigation';
import { useFetch } from '@/hooks/useFetch';
import { loadLeaflet, L_Instance } from '@/utils/leaflet';
import { useMutation } from '@/hooks/useMutation';
import Link from 'next/link';
import { io } from 'socket.io-client';
import { BASE_URL } from '@/utils/constants';

const socket = io(`${BASE_URL ?? 'http://localhost:5000'}`, {
  withCredentials: true,  // Ensure cookies are sent
  transports: ["websocket"]  // To use WebSockets as transport
});

const SchoolBusRoute = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [tripStatus,setTripStatus]=useState(false);
  const driverData = JSON.parse(localStorage.getItem('driverData'))
  const {id : trip_id} = useParams();
  
  const { data , loading: tripsLoading, error: tripsError } = useFetch(`/api/drivers/1/trip/${trip_id}`,tripStatus);

  const busStops = data?.routes?.locations ?? []
  // console.log(busStops)
  const routeData = {
    name: `${data?.routes?.start}-${data?.routes?.end}` ?? "Route Name",
    date: data?.departure ?? 'date',
    stops: busStops?.length,
    children: 15,
    status: data?.status ?? 'pending'
  };

  const [routeCoordinates, setRouteCoordinates] = useState([]);

  useEffect(() => {
    loadLeaflet(setIsMapLoaded);

    return () => {
      // Cleanup
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [tripsLoading]);

  useEffect(() => {
    if (!tripsLoading && isMapLoaded && mapRef.current && !mapInstance.current) {
      // Initialize the map with Nairobi center
      mapInstance.current = L_Instance.map(mapRef.current).setView([-1.092, 36.982], 12);

      // Add tile layer
      L_Instance.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance.current);

      // Get route that follows roads
      getRouteFromStops(busStops, setRouteCoordinates);
      // console.log('routeCoordinates',routeCoordinates);

      // // Add bus stop markers with validation
      busStops.forEach((stop, index) => {
        // Validate stop coordinates
        if (!stop || typeof stop?.latitude !== 'number' || typeof stop?.longitude !== 'number') {
          console.warn(`Invalid stop data at index ${index}:`, stop);
          return;
        }

        const stopIcon = L_Instance.divIcon({
          html: `<div class="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-md">
                   ${index + 1}
                 </div>`,
          className: 'custom-stop-marker',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        L_Instance.marker([stop?.latitude, stop?.longitude], { icon: stopIcon })
          .bindPopup(stop?.location_name || `Stop ${index + 1}`)
          .addTo(mapInstance.current);
      });

      // Fit map to show the bus stops initially
      const validStops = busStops?.filter(stop => 
        stop && typeof stop?.latitude === 'number' && typeof stop?.longitude === 'number'
      );
      
      if (validStops?.length > 0) {
        const bounds = L_Instance?.latLngBounds(validStops?.map(stop => [stop?.latitude, stop?.longitude]));
        // console.log(bounds)
        mapInstance.current.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [isMapLoaded, tripsLoading]);

  // // Effect to add route line when coordinates are available
  useEffect(() => {
    if (mapInstance.current && routeCoordinates?.length > 0) {
      // Validate coordinates before using them
      const validCoordinates = routeCoordinates?.filter(coord => 
        coord && Array.isArray(coord) && coord?.length >= 2 && 
        typeof coord[0] === 'number' && typeof coord[1] === 'number'
      );

      if (validCoordinates?.length === 0) {
        console.warn('No valid coordinates found for route');
        return;
      }
      // console.log(validCoordinates);
      // Create route polyline
      // console.log('Map instance:', mapInstance.current);
      // console.log('Is valid Leaflet map:', mapInstance.current instanceof L_Instance.Map);
      if (
        typeof window !== 'undefined' &&
          mapInstance.current &&
          mapInstance.current instanceof L_Instance.Map
      ) {
        const routeLine = L_Instance.polyline(validCoordinates, {
          color: '#8B5CF6',
          weight: 4,
          opacity: 0.8
        }).addTo(mapInstance.current);
      } else {
        console.warn("Invalid or empty coordinates", validCoordinates);
      }

      // Create custom bus icon
      const busIconPinned = window.L.divIcon({
        html: `<div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-lg">
                
               </div>`,
        className: 'custom-bus-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      // Add bus marker at the end of route (use last valid coordinate)
      const lastCoord = validCoordinates[validCoordinates?.length - 1];
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

  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [tracking, setTracking] = useState(true); // start tracking by default
  const watchIdRef = useRef(null); // store the watchId persistently


  // Connect to socket.io server
  socket.on('connect', () => {
    console.log('Connected to server');
  });

  // Manage geolocation tracking
  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    if (tracking) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({ latitude, longitude });
          console.log({ latitude, longitude })

          socket.emit('bus_location_update', {
            driver_id: 1, // replace with real driver ID (logged in as driver)
            trip_id,
            latitude,
            longitude,
            speed: 15,  // Temporary 
            timestamp: new Date().toISOString()
          });
        },
        (err) => {
          console.error("Location error:", err);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 10000,
        }
      );
    } else if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    // Cleanup on unmount
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [tracking, trip_id]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Map Container */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="w-full h-full" />
        
        {/* Mobile Route Info Overlay (Bottom) - Hidden on desktop */}
        <div className="md:hidden absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-xl border-t border-gray-200 z-1000">
          <Link href={'/driver/home'}>Go back to home</Link>
          {routeData?.status === 'pending' ? 
            <StartTripComponent driverData={driverData} routeData={routeData} setTripStatus={setTripStatus} trip_id={trip_id} setTracking={setTracking}/> :
            <InTripComponent driverData={driverData} routeData={routeData} busStops={busStops} setTripStatus={setTripStatus} trip_id={trip_id} setTracking={setTracking}/>
          }
        </div>
      </div>

      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden md:block w-80 bg-white shadow-xl">
        <Link href={'/driver/home'}>Go back to home</Link>
        {routeData?.status === 'pending' ? 
          <StartTripComponent driverData={driverData} routeData={routeData} setTripStatus={setTripStatus} trip_id={trip_id} setTracking={setTracking}/> :
          <InTripComponent driverData={driverData} routeData={routeData} desktopClassName={'h-full flex flex-col'} busStops={busStops} setTripStatus={setTripStatus} trip_id={trip_id} setTracking={setTracking}/>
        }
      </div>
    </div>
  );
};

export default SchoolBusRoute;


const StartTripComponent=(({routeData, desktopClassName='',setTripStatus,trip_id, setTracking, driverData})=>{
  const router = useRouter()
  const { mutate } = useMutation(`/api/drivers/${driverData?.id}/trip/${trip_id}`,'PATCH');
  const handleStartRide=async()=>{
    try {
      const data = await mutate({status: 'started'});
      setTripStatus('started')
      setTracking(true)
      return data;
    } catch (error) {
      throw error;
    }
  }
  return(
    <Container>
      <div className={`p-6 ${desktopClassName}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            {busIcon('text-white','text-2xl')}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{routeData?.name}</h3>
            <p className="text-sm text-gray-500">{routeData?.date}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {mapPinIcon()}
            <span>{routeData?.stops} stops</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {groupIcon()}
            <span>{routeData?.children} children</span>
          </div>
        </div>

        <div className="mb-4">
          <span className={`inline-block px-3 py-1 ${routeData?.status !== 'ended' ? 'bg-primary': 'bg-green-400'} text-dark rounded-full text-sm font-medium`}>
            {routeData?.status}
          </span>
        </div>
        {routeData?.status !== 'ended' && (
          <button className="w-full bg-primary hover:bg-dark text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors" onClick={()=>{handleStartRide()}}>
            {playIcon()}
            Start Ride
          </button>
        )}

      </div>
    </Container>
  )
});

const InTripComponent=(({routeData, desktopClassName='', busStops, setTripStatus, trip_id, setTracking, driverData})=>{
  const { mutate } = useMutation(`/api/drivers/${driverData?.id}/trip/${trip_id}`,'PATCH');
  const handleUpdateTripStatus=async(body)=>{
    try {
      const data = await mutate(body);
      setTripStatus(body?.status)
      setTracking(false)
      return data;
    } catch (error) {
      throw error;
    }
  }
  return(
    <Container>
      <div className={`p-6 ${desktopClassName}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            {busIcon('text-white','text-2xl')}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{routeData?.name}</h3>
            <p className="text-sm text-gray-500">{routeData?.date}</p>
          </div>
        </div>

        <Container className={`no-scrollbar overflow-scroll ${desktopClassName ? 'h-100' :'h-50'}`}>
          {busStops?.length > 0 && busStops?.map((stop,index)=>{
            // Determine the position of the stop
            const isFirst = index === 0;
            const isLast = index === busStops.length - 1;
            const stopType = isFirst ? 'start' : isLast ? 'end' : 'onRoute';
            const icons = {
              'start':mapPinIcon('text-primary text-xl'),
              'onRoute':arrowLocationIcon('text-dark text-xl'),
              'end':flagIcon('text-secondary text-xl')
            }
            return(
              <Container className={`flex flex-col my-2 ${isFirst && 'bg-amber-100 p-1 rounded-md shadow-sm'}`} key={index}>
                <Container className='flex flex-row gap-4'>
                  {/* Icon selection goes here */}
                  {icons[stopType]}
                  {/* Details go here */}
                  <Container className='flex flex-col'>
                    <Text>{stop?.location_name}</Text>
                    <Text>{stop?.tta ?? '1 min'}</Text>
                  </Container>
                </Container>
                {/* Dotted connector line (not shown after the last stop) */}
                {!isLast && (
                  <div className="ml-2 border-l-2 border-dotted border-gray-400 h-6"></div>
                )}
                {/* dots go here */}
              </Container>
            )
          })}
        </Container>

        <div className="my-4">
          <span className="inline-block px-3 py-1 bg-secondary text-dark rounded-full text-sm font-medium">
            {routeData?.status}
          </span>
        </div>

        <Container className='flex flex-row gap-4 align-middle'>
          {routeData?.status !== 'ended' && (
            <>
              <button className="w-full bg-red-400 hover:bg-red-400 text-white font-semibold py-2 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors" onClick={()=>{handleUpdateTripStatus({status: 'pending'})}}>
                Cancel
              </button>
              <button className="w-full bg-dark text-white font-semibold py-2 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors" onClick={()=>{handleUpdateTripStatus({status: 'ended'})}}>
                Complete
              </button>
            </>
          )}
        </Container>

      </div>
    </Container>
  )
});

const dummyData = {
  1: [
      { lat: -1.105225, lng: 37.016789, name: "JKUAT Entry road" },
      { lat: -1.120837, lng: 37.008421, name: "Thika Super Highway, Kalimoni" }, 
      { lat: -1.131100, lng: 36.981719, name: "Rubis Kimbo Service Station" }
    ],
  2: [
      { lat: -1.105225, lng: 37.016789, name: "JKUAT Entry Road" },
      { lat: -1.117500, lng: 37.011100, name: "Kalimoni Junction" },
      { lat: -1.124200, lng: 37.002300, name: "Weitethie Stage" },
      { lat: -1.138300, lng: 36.991900, name: "Kimbo Bus Stop" },
      { lat: -1.208500, lng: 36.899100, name: "Roysambu Stage" }
    ],
  3:[
      { lat: -1.033500, lng: 37.070200, name: "Thika Main Stage" },
      { lat: -1.041300, lng: 37.054600, name: "Makongeni" },
      { lat: -1.065900, lng: 37.034000, name: "Kiganjo" },
      { lat: -1.078800, lng: 37.025500, name: "Kalimoni Highrise" },
      { lat: -1.100000, lng: 37.015000, name: "Juja Farm Junction" },
      { lat: -1.120000, lng: 37.005000, name: "Weitethie" },
      { lat: -1.140000, lng: 36.995000, name: "Ruiru Bypass" },
      { lat: -1.175000, lng: 36.940000, name: "Githurai 45" },
      { lat: -1.210000, lng: 36.920000, name: "Kasarani" },
      { lat: -1.284100, lng: 36.815600, name: "Nairobi CBD" }
    ],
  4:[
      { lat: -1.292100, lng: 36.821900, name: "Kencom Stage" },
      { lat: -1.286000, lng: 36.828400, name: "GPO" },
      { lat: -1.281700, lng: 36.837800, name: "Ngara Market" },
      { lat: -1.266700, lng: 36.844400, name: "Parklands Avenue" },
      { lat: -1.258000, lng: 36.857000, name: "Westlands Stage" },
      { lat: -1.252500, lng: 36.868700, name: "Sarit Centre" },
      { lat: -1.245800, lng: 36.874200, name: "Rhapta Road" },
      { lat: -1.238600, lng: 36.882900, name: "Kangemi" },
      { lat: -1.241100, lng: 36.897500, name: "Mountain View" },
      { lat: -1.250000, lng: 36.915000, name: "Uthiru" }
    ]
}
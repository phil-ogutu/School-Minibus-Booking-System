"use client";
import Navbar from "@/components/Navbar";
import dynamic from "next/dynamic";
import { useAuth } from "@/hooks/useAuth";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { BASE_URL } from "@/utils/constants";
import {
  FaArrowDown,
  FaBus,
  FaClock,
  FaLocationArrow,
  FaMapMarker,
  FaMapMarkerAlt,
  FaMapPin,
  FaPersonBooth,
  FaUser,
} from "react-icons/fa";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function TrackPage() {
  const searchParams = useSearchParams(); // Get query parameters
  const queryId = searchParams.get('id'); // Get 'id' from query params
  const { isAuthenticated } = useAuth();
  const [trackingNumber, setTrackingNumber] = useState(id || ""); // Pre-fill with URL ID
  const [trackingError, setTrackingError] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [trackingData, setTrackingData] = useState(null);

  // // Load tracking number from localStorage on component mount
  // useEffect(() => {
  //   const savedTrackingNumber = localStorage.getItem('trackingNumber');
  //   if (savedTrackingNumber) {
  //     setTrackingNumber(savedTrackingNumber);
  //     handleTrack(savedTrackingNumber);
  //   }
  // }, [isAuthenticated]);

  // Auto-track when component mounts if there's an ID in URL
  useEffect(() => {
    if (isAuthenticated && id) {
      setTrackingNumber(id);
      handleTrack(id);
    } else {
      // Load tracking number from localStorage as fallback
      const savedTrackingNumber = localStorage.getItem('trackingNumber');
      if (savedTrackingNumber && isAuthenticated) {
        setTrackingNumber(savedTrackingNumber);
        handleTrack(savedTrackingNumber);
      }
    }
  }, [id, isAuthenticated]);

  const fetchTrackingData = async (bookingId) => {
    try {
      // Fetch booking data
      const bookingResponse = await fetch(`${BASE_URL}/api/bookings/${bookingId}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!bookingResponse.ok) {
        throw new Error('Booking not found');
      }

      const booking = await bookingResponse.json();

      // Fetch bus data if bus_id exists
      let bus = null;
      let route = null;

      if (booking.bus_id) {
        const busResponse = await fetch(`${BASE_URL}/api/buses/${booking.bus_id}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (busResponse.ok) {
          bus = await busResponse.json();

          // Fetch route data if route_id exists
          if (bus.route_id) {
            const routeResponse = await fetch(`${BASE_URL}/api/routes/${bus.route_id}`, {
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            if (routeResponse.ok) {
              route = await routeResponse.json();
            }
          }
        }
      }

      return { booking, bus, route };
    } catch (error) {
      throw error;
    }
  };

  const handleTrack = async (trackingId = trackingNumber) => {
    if (!isAuthenticated) {
      setTrackingError("Please log in to track your booking");
      return;
    }

    if (!trackingId.trim()) {
      setTrackingError("Please enter a tracking number");
      return;
    }

    setIsTracking(true);
    setTrackingError("");
    
    try {
      // Save tracking number to localStorage
      localStorage.setItem('trackingNumber', trackingId);
      
      const { booking, bus, route } = await fetchTrackingData(trackingId);

      // Transform data for display
      const transformedData = {
        from: booking.pickup || "N/A",
        to: booking.dropoff || "N/A", 
        tripStartTime: bus?.departure ? new Date(bus.departure).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "4:00 am",
        studentName: booking.child_name || "N/A",
        studentNumber: booking.id.toString(),
        currentLocation: booking.pickup || "Starting Point",
        destination: booking.dropoff || "Destination",
        routeLocations: route?.locations || []
      };

      setTrackingData(transformedData);

    } catch (error) {
      setTrackingError("Tracking number not found. Please check and try again.");
      setTrackingData(null);
    } finally {
      setIsTracking(false);
    }
  };

  // Show login message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <FaBus className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
            <h2 className="text-xl font-medium mb-2">Authentication Required</h2>
            <p className="text-neutral-600">Please log in to track your booking</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 grid grid-cols-2">
        {/* Left Side */}
        <div className="p-5 overflow-y-auto no-scrollbar h-[calc(100vh-150px)]">
          {/* Tracking Input Section */}
          <div className="mb-5 w-[80%] shadow-sm bg-white border rounded-xl p-4 border-neutral-300 mx-auto">
            <div className="flex justify-start items-center gap-x-3 text-xl mb-4">
              <FaLocationArrow className="w-5 h-5" />
              <h1>Track Your Trip</h1>
            </div>
            
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Tracking Number"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
                />
                <button
                  onClick={() => handleTrack()}
                  disabled={isTracking}
                  className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 text-black font-medium rounded-lg transition-colors"
                >
                  {isTracking ? 'Tracking...' : 'Track'}
                </button>
              </div>
              
              {trackingError && (
                <p className="text-red-500 text-sm">{trackingError}</p>
              )}
            </div>
          </div>

          {/* Tracking Results */}
          {trackingData && (
            <>
              {/* Trip Information */}
              <div className="mb-5 w-[80%] shadow-sm bg-white border rounded-xl p-4 border-neutral-300 mx-auto">
                <div className="flex justify-start gap-x-2 text-xl mb-4">
                  <span>{trackingData.from}</span>
                  <span>⟷</span>
                  <span>{trackingData.to}</span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <FaClock className="w-4 h-4 text-neutral-600" />
                    <span>Trip Starts at: {trackingData.tripStartTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaUser className="w-4 h-4 text-neutral-600" />
                    <span>Student Name: {trackingData.studentName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPersonBooth className="w-4 h-4 text-neutral-600" />
                    <span>Student Number: {trackingData.studentNumber}</span>
                  </div>
                </div>
              </div>

              {/* Trip Progress */}
              <div className="mb-5 w-[80%] shadow-sm bg-white border rounded-xl p-4 border-neutral-300 mx-auto">
                <div className="flex justify-start items-center gap-x-3 text-xl mb-4">
                  <FaMapPin className="w-5 h-5" />
                  <h2>Trip Progress</h2>
                </div>
                
                <div className="space-y-3">
                  {/* Current Location */}
                  <div className="flex items-center gap-x-3 bg-green-50 p-3 rounded-lg border border-green-200">
                    <FaMapMarker className="w-4 h-4 text-green-600" />
                    <div>
                      <div className="font-medium text-green-800">📍 {trackingData.currentLocation}</div>
                      <div className="text-xs text-green-600">Current Location</div>
                    </div>
                  </div>
                  
                  {/* Direction Arrow */}
                  <div className="flex justify-center">
                    <FaArrowDown className="w-4 h-4 text-neutral-400" />
                  </div>
                  
                  {/* Destination */}
                  <div className="flex items-center gap-x-3 bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
                      <span className="text-white text-xs">🏁</span>
                    </div>
                    <div>
                      <div className="font-medium text-blue-800">{trackingData.destination}</div>
                      <div className="text-xs text-blue-600">Destination</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* No tracking data message */}
          {!trackingData && !trackingError && !isTracking && (
            <div className="text-center text-neutral-500 mt-10">
              <FaBus className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
              <p>Enter a tracking number to view trip details</p>
            </div>
          )}
        </div>

        {/* Right Side - Map */}
        <div className="hidden md:block md:w-full md:h-full md:p-2">
          <Map locations={trackingData?.routeLocations || []} />
        </div>
      </div>
    </div>
  );
}
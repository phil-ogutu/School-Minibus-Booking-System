"use client";
import Navbar from "@/components/Navbar";
import dynamic from "next/dynamic";
import { useBuses } from "@/hooks/useBuses";
import { useRoutes } from "@/hooks/useRoutes";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import BookBusModal from "@/components/BookBusModal";
import {
  FaArrowDown,
  FaArrowRight,
  FaBus,
  FaChevronDown,
  FaChevronUp,
  FaCircle,
  FaClock,
  FaLocationArrow,
  FaMapMarkedAlt,
  FaMapMarker,
  FaMapMarkerAlt,
  FaMapPin,
  FaPersonBooth,
  FaUser,
} from "react-icons/fa";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Bus() {
  const { routeId } = useParams();
  const { getRouteById } = useRoutes();
  const { route } = getRouteById(routeId);
  const { buses } = useBuses();

  // Updated state variables for tracking functionality
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingData, setTrackingData] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingError, setTrackingError] = useState("");

  const stops = route?.locations.slice(1, -1); // exclude first and last

  // Function to handle tracking
  const handleTrack = async () => {
    if (!trackingNumber.trim()) {
      setTrackingError("Please enter a tracking number");
      return;
    }

    setIsTracking(true);
    setTrackingError("");
    
    try {
      // Replace this URL with your actual backend endpoint
      const response = await fetch(`/api/track/${trackingNumber}`);
      
      if (!response.ok) {
        throw new Error("Tracking number not found");
      }
      
      const data = await response.json();
      setTrackingData(data);
    } catch (error) {
      setTrackingError("Unable to find tracking information. Please check your tracking number.");
      setTrackingData(null);
    } finally {
      setIsTracking(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 grid grid-cols-2">
        {/* Left Side - MODIFIED FOR TRACKING */}
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
                  onClick={handleTrack}
                  disabled={isTracking}
                  className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-300 text-black font-medium rounded-lg transition-colors"
                >
                  {isTracking ? "Tracking..." : "Track"}
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
              {/* Route Information */}
              <div className="mb-5 w-[80%] shadow-sm bg-white border rounded-xl p-4 border-neutral-300 mx-auto">
                <div className="flex justify-start items-center gap-x-3 text-xl mb-2">
                  <FaMapMarkerAlt className="w-5 h-5" />
                  <h1>Trip Information</h1>
                </div>
                <div className="flex justify-start gap-x-2 text-xl mb-3">
                  <span>{trackingData.from}</span>
                  <span>&harr;</span>
                  <span>{trackingData.to}</span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <FaClock className="w-4 h-4 text-neutral-600" />
                    <span>Trip Starts at: <strong>{trackingData.tripStartTime}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaUser className="w-4 h-4 text-neutral-600" />
                    <span>Student Name: <strong>{trackingData.studentName}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPersonBooth className="w-4 h-4 text-neutral-600" />
                    <span>Student Number: <strong>{trackingData.studentNumber}</strong></span>
                  </div>
                </div>
              </div>

              {/* Trip Route Progress */}
              <div className="mb-5 w-[80%] shadow-sm bg-white border rounded-xl p-4 border-neutral-300 mx-auto">
                <div className="flex justify-start items-center gap-x-3 text-xl mb-4">
                  <FaMapPin className="w-5 h-5" />
                  <h1>Route Progress</h1>
                </div>
                
                <div className="space-y-4">
                  {/* Starting Point */}
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <FaMapMarker className="w-4 h-4 text-green-500" />
                      <div className="w-0.5 h-8 bg-neutral-300"></div>
                    </div>
                    <div>
                      <div className="font-medium">{trackingData.from}</div>
                      <div className="text-xs text-neutral-500">Starting Point</div>
                    </div>
                  </div>

                  {/* Intermediate Stops */}
                  {trackingData.intermediateStops?.map((stop, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <FaCircle className={`w-3 h-3 ${stop.passed ? 'text-green-500' : 'text-neutral-400'}`} />
                        {index < trackingData.intermediateStops.length - 1 && (
                          <div className="w-0.5 h-8 bg-neutral-300"></div>
                        )}
                      </div>
                      <div>
                        <div className={`font-medium ${stop.passed ? 'text-green-600' : 'text-neutral-600'}`}>
                          {stop.name}
                        </div>
                        <div className="text-xs text-neutral-500">
                          {stop.passed ? 'Passed' : 'Upcoming'}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Final arrow pointing to destination */}
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <FaArrowDown className="w-4 h-4 text-neutral-600" />
                    </div>
                    <div className="text-neutral-600">⬇️</div>
                  </div>

                  {/* Destination */}
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 bg-red-500 rounded-sm flex items-center justify-center">
                        <span className="text-white text-xs font-bold">🏁</span>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">{trackingData.to}</div>
                      <div className="text-xs text-neutral-500">Destination</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Status */}
              <div className="mb-5 w-[80%] shadow-sm bg-white border rounded-xl p-4 border-neutral-300 mx-auto">
                <div className="flex justify-start items-center gap-x-3 text-xl mb-2">
                  <FaBus className="w-5 h-5" />
                  <h1>Current Status</h1>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">
                    {trackingData.currentStatus || "Bus is on route"}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Last updated: {trackingData.lastUpdated || "Just now"}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Side - UNCHANGED */}
        <div className="hidden md:block md:w-full md:h-full md:p-2">
          <Map locations={route?.locations} />
        </div>
      </div>
    </div>
  );
}
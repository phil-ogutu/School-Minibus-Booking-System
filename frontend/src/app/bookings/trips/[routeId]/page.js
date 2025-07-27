"use client";
import Navbar from "@/components/Navbar";
import dynamic from "next/dynamic";
import { useBuses } from "@/hooks/useBuses";
import { useRoutes } from "@/hooks/useRoutes";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import BookBusModal from "@/components/BookBusModal";
import {
  FaBus,
  FaCircle,
  FaClock,
  FaMapMarkerAlt,
  FaUser,
} from "react-icons/fa";
import { useRouter } from "next/navigation";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Bus() {
  const { routeId } = useParams();
  const { getRouteById } = useRoutes();
  const { route } = getRouteById(routeId);
  const { buses } = useBuses();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const stops = route?.locations.slice(1, -1);
  const visibleStops = expanded ? stops : stops?.slice(0, 4);

  const openModal = (bus) => {
    setSelectedBus(bus);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedBus(null);
    setIsModalOpen(false);
  };

  const router = useRouter();

  const navigateToTrack = (id) => {
    if (id) {
      router.push(`/track/${id}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 md:grid grid-cols-2">

        {/* Left Side */}
        <div className="p-5 overflow-y-auto no-scrollbar h-[calc(100vh-150px)]">
          
          {/* Route Name and stops */}
          <div className="mb-5 w-full shadow-sm bg-white border rounded-xl p-4 border-neutral-300 mx-auto">
            <div className="flex justify-start items-center gap-x-3 text-xl mb-2">
              <FaMapMarkerAlt className="w-5 h-5" />
              <h1 className="font-medium">Route Information</h1>
            </div>
            <div className="flex md:justify-start md:gap-x-2 md:text-xl">
              <span>{route?.start}</span>
              <span>&rarr;</span>
              <span>{route?.end}</span>
            </div>

            <div className="mt-3">
              <ul>
                {visibleStops?.map((loc) => (
                  <li
                    key={loc.id}
                    className="w-full flex items-center gap-2 bg-neutral-100/80 p-2 mb-2 rounded-sm"
                  >
                    <FaCircle className="w-2 h-2 text-neutral-600" />
                    {loc.location_name}
                  </li>
                ))}
              </ul>
              {stops?.length > 4 && (
                <div className="flex justify-end">
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-yellow-600 text-sm mt-2"
                  >
                    {expanded ? "View Less" : "View More"}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mb-5 text-xl font-medium">Available Buses</div>

          {/* Bus Cards */}
          <div className="md:grid grid-cols-2 gap-2">
            {buses
              ?.filter((bus) => bus.route_id === route.id)
              .map((bus) => {
                const departureTime = new Date(
                  bus.departure
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={bus.id}
                    className="w-full mb-5 shadow-sm bg-white border hover:scale-[1.005] rounded-xl p-4  border-neutral-300 space-y-4"
                  >
                    <div className="flex justify-start gap-x-4">
                      <FaBus className="h-12 w-10" />
                      <div className="flex flex-col">
                        <h1 className="text-xl font-medium">{bus.plate}</h1>
                        <span className="text-xs font-light">
                          {route.start} - {route.end}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-2">
                      <div className="flex items-center gap-x-2 border border-neutral-400 bg-gray-200/60 shadow-sm p-2 rounded-lg">
                        <FaClock />
                        <div className="flex flex-col">
                          <span className="text-xs">Departure</span>
                          <span>{departureTime}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-x-2 border border-neutral-400 bg-gray-200/60 shadow-sm p-2 rounded-lg">
                        <FaUser />
                        <div className="flex flex-col">
                          <span className="text-xs">Capacity</span>
                          <span>10/50</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <button
                        onClick={() => openModal(bus)}
                        className="w-full px-2 py-1.5 h-full text-base font-medium rounded-lg bg-yellow-400 hover:bg-yellow-500"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="hidden md:block md:w-full md:h-full md:p-2">
          <Map locations={route?.locations} />
        </div>
      </div>

      <BookBusModal
        isOpen={isModalOpen}
        onClose={closeModal}
        route={route}
        bus={selectedBus}
        onNavigate={navigateToTrack}
      />
    </div>
  );
}

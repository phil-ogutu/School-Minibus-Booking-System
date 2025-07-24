"use client";

import React, { useState } from "react";
import { FaArrowDown, FaArrowRight, FaChevronDown, FaChevronUp, FaCircle, FaLocationArrow } from "react-icons/fa";
import BookBusModal from "./BookBusModal";
import { routesData } from "@/data/RoutesData";
import { format } from "date-fns";
import { fetchLatLng } from "@/utils/geocode";

const SearchCard = ({ route }) => {
  console.log("Search Card", route);
  const [isModalOpen, setModalOpen] = useState(false);
  const today = new Date();
  const formattedDate = format(today, "dd/MM/yyyy");

  const [showStops, setShowStops] = useState(false);

  const handleGetPrice = async () => {
    const fromCoords = await fetchLatLng(route.start);
    const toCoords = await fetchLatLng(route.end);

    const distance = haversineDistance(fromCoords, toCoords);
    const route_price = calculatePrice(distance); // Update price
    if (route_price) {
      return <span>route_price</span>;
    }
  };

  return (
    <div className="w-[98%] mx-auto mb-5 shadow-sm bg-white border hover:scale-[1.005] rounded-xl p-4  border-neutral-300 space-y-4">
      <div className="space-y-2 w-full">
        {/* Route */}
        <div className="space-y-0">
          <div className="w-full flex items-center justify-between">
            <p className="text-xs text-neutral-400 font-normal">From</p>
            <p className="text-xs text-neutral-400 font-normal">To</p>
          </div>

          <div className="flex items-center justify-between gap-x-5">
            <h1 className="text-lg md:text-xl text-neutral-600 font-semibold w-1/3">
              {route.start}
            </h1>

            <div className="flex-1  border-dashed border border-neutral-400 relative">
              <div className="absolute w-8 h-8 z-50 px-3 h-6 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-neutral-100 rounded-full flex items-center justify-center">
                <FaArrowRight className="absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-neutral-500" />
              </div>
            </div>

            <h1 className="text-lg md:text-xl text-neutral-600 font-semibold w-1/3 text-right">
              {route.end}
            </h1>
          </div>
        </div>
      </div>
      
      <div
        onClick={() => setShowStops(!showStops)}
        className=""
      >
        {showStops ? (
          <FaChevronUp className="text-neutral-500 text-sm" />
        ) : (
          <div className="flex items-center space-x-2">
          <FaLocationArrow className="text-neutral-500 text-sm" />
          <p className="text-xs">stops</p>
          </div>
        )}
      </div>

      {showStops && route.locations.length > 2 && (
        <div className="w-[95%] mt-2 bg-neutral-300/20 space-y-2 pl-10 mx-auto rounded-md">
          {route.locations.slice(1, -1).map((location) => (
            <div key={location.id} className="flex items-center gap-x-2">
              <FaCircle className="w-2 h-2 text-neutral-500" />
              <p className="text-sm text-neutral-600">
                {location.location_name}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="w-full flex items-center justify-end">
        {/* <h1 className="text-lg text-neutral-700 font-semibold">{() =>handleGetPrice}</h1> */}
        {/* <h1 className="text-lg text-neutral-700 font-semibold">Ksh 100</h1> */}

        <button
          onClick={() => setModalOpen(true)}
          className="w-fit px-2 py-1.5 h-full text-base text-yellow-600 font-medium hover:text-neutral-400"
        >
          Book Now
        </button>

        <BookBusModal
          isOpen={isModalOpen}
          route={route}
          onClose={() => setModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default SearchCard;


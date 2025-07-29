"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Added this to use the inline router.push
import {
  FaArrowDown,
  FaArrowRight,
  FaChevronDown,
  FaChevronUp,
  FaCircle,
  FaLocationArrow,
} from "react-icons/fa";
import BookBusModal from "./BookBusModal";
import { routesData } from "@/data/RoutesData";
import { format } from "date-fns";
import { fetchLatLng } from "@/utils/geocode";

const SearchCard = ({ route, onPreview, onSelect }) => {
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

  const truncateWords = (text, limit = 2) => {
    const words = text.split(" ");
    return words.length > limit
      ? words.slice(0, limit).join(" ") + "..."
      : text;
  };

  return (
    <div
      // className={`flex flex-col mb-5 shadow-sm bg-white border hover:scale-[1.005] rounded-xl p-4  border-neutral-300 space-y-2 h-auto`}
      className={`flex flex-col mb-5 shadow-sm bg-white border hover:scale-[1.005] rounded-xl p-4 border-neutral-300 ${
        showStops ? "h-auto" : "h-[200px]"
      }`}
      onClick={onPreview}
    >
      <div className="w-full mb-3">
        {/* Route */}
        <div className="space-y-0">
          <div className="w-full flex items-center justify-between">
            <p className="text-xs text-neutral-400 font-normal">From</p>
            <p className="text-xs text-neutral-400 font-normal">To</p>
          </div>

          <div className="flex items-center justify-between gap-x-5">
            <h1 className="text-base md:text-lg font-semibold w-1/3">
              {truncateWords(route.start)}
            </h1>

            <div className="flex-1  border-dashed border border-neutral-400 relative">
              <div className="absolute w-8 h-8 z-50 px-3 h-6 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-neutral-100 rounded-full flex items-center justify-center">
                <FaArrowRight className="absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-neutral-500" />
              </div>
            </div>

            <h1 className="text-base md:text-lg font-semibold w-1/3 text-right">
              {truncateWords(route.end)}
            </h1>
          </div>
        </div>
      </div>

      <div onClick={() => setShowStops(!showStops)} className="mb-2">
        {showStops ? (
          <FaChevronUp className="text-neutral-500" />
        ) : (
          <div className="flex items-center space-x-2">
            <FaLocationArrow className="text-sm" />
            <p className="text-sm">stops</p>
          </div>
        )}
      </div>

      {showStops && route.locations.length > 2 && (
        <div className="w-[95%] mt-2 bg-neutral-300/20 space-y-2 mx-auto rounded-md p-2">
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

      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        className="w-full px-2 py-1.5 mt-auto text-base font-medium rounded-lg bg-yellow-400 hover:bg-yellow-500"
      >
        View Buses
      </button>
      {/* added the pay now call to action button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/payment?tripId=${route.id}`);
        }}
        className="w-full px-2 py-1.5 mt-2 text-base font-medium rounded-lg bg-green-600 hover:bg-green-700 text-white"
      >
        Pay Now
      </button>
    </div>
  );
};

export default SearchCard;

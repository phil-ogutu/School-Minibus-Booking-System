"use client";
import React, { useState } from "react";
import { FaCircle } from "react-icons/fa";
import BookBusModal from "./BookBusModal";
import { routesData } from "@/data/RoutesData";
import { format } from "date-fns";
import { fetchLatLng } from "@/utils/geocode";

const SearchCard = ({route}) => {
    console.log("Search Card", route)
    const [isModalOpen, setModalOpen] = useState(false);
    const today = new Date();
    const formattedDate = format(today, 'dd/MM/yyyy');

    const handleGetPrice = async () => {

        const fromCoords = await fetchLatLng(route.start);
        const toCoords = await fetchLatLng(route.end);
        console.log("Search Card coor", fromCoords)
    
        const distance = haversineDistance(fromCoords, toCoords);
        const route_price = calculatePrice(distance);  // Update price
        if (route_price ) {
          return <span>route_price</span>
        }
      };


  return (
    <div className="w-full mb-5 rounded-xl p-5 border-2 border-neutral-300 space-y-4">
      <div className="space-y-2 w-full">
        {/* Route */}
        <div className="space-y-0">
          <div className="w-full flex items-center justify-between">
            <p className="text-xs text-neutral-400 font-normal">From</p>
            <p className="text-xs text-neutral-400 font-normal">To</p>
          </div>

          <div className="w-full flex items-center justify-between gap-x-3">
            <h1 className="text-xl text-neutral-600 font-semibold">{route.start}</h1>

           <div className="flex-1 border-dashed border border-neutral-400 relative">
            <p className="absolute w-fit px-3 h-6 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-neutral-50 rounded-full text-md font-normal">{formattedDate}</p>
           </div>

            <h1 className="text-xl text-neutral-600 font-semibold">{route.end}</h1>
          </div>
        </div>
      </div>

      {console.log("Search Card Locations", route.locations)}
      {
        route.locations.length > 0 && route.locations.map(
          (location,index) => (
            <div key={location.id || index} className="w-full flex items-center justify-center-safe gap-x-20">
              <div className="flex flex-col items-center">
                <FaCircle className="w-2.5 h-2.5 text-neutral-600"/>
                <p className="text-sm text-neutral-600 font-normal">{location.location_name}</p>
              </div>
            </div>
          )
        )
      }
      {/* <div className="w-full flex items-center justify-center-safe gap-x-20">
        <div className="flex flex-col items-center">
          <FaCircle className="w-2.5 h-2.5 text-neutral-600"/>
          <p className="text-sm text-neutral-600 font-normal">Nairobi</p>
        </div>

         <div className="flex flex-col items-center">
          <FaCircle className="w-2.5 h-2.5 text-neutral-600"/>
          <p className="text-sm text-neutral-600 font-normal">Imaara</p>
        </div>

         <div className="flex flex-col items-center">
          <FaCircle className="w-2.5 h-2.5 text-neutral-600"/>
          <p className="text-sm text-neutral-600 font-normal">Syokimau</p>
        </div>

         <div className="flex flex-col items-center">
          <FaCircle className="w-2.5 h-2.5 text-neutral-600"/>
          <p className="text-sm text-neutral-600 font-normal">Kitengela</p>
        </div>
      </div> */}

      <div className="w-full flex items-center justify-between">
        {/* <h1 className="text-lg text-neutral-700 font-semibold">{() =>handleGetPrice}</h1> */}
        <h1 className="text-lg text-neutral-700 font-semibold">Ksh 100</h1>


        <button onClick={() => setModalOpen(true)} className="w-fit px-5 py-1.5 h-full text-lg text-white font-light bg-yellow-500 hover:bg-yellow-600 rounded-xl">
          Book Now
        </button>

        <BookBusModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />

      </div>
    </div>
  );
};

export default SearchCard;

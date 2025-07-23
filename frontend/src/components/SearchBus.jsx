
"use client"
import { useState } from "react";
import dynamic from "next/dynamic"; // for map
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
// import { fetchAllRoutes } from '../store/routesSlice';
import { fetchLatLng } from '../utils/geocode';
import { haversineDistance, calculatePrice } from '../utils/distance';
import { useTheContext } from "@/context/MapContext";

const MapComponent = dynamic(() => import("./MapComponent"), { ssr: false });

const SearchBus = () => {
  // const [from, setFrom] = useState("");
  // const [to, setTo] = useState("");
  const [coords, setCoords] = useState({ fromLatLng: null, toLatLng: null });
  const [showMap, setShowMap] = useState(false);
  const [routePrice, setRoutePrice] = useState();
  const { from, setFrom, to, setTo, setCoordinates } = useTheContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fromCoords = await fetchLatLng(from);
    const toCoords = await fetchLatLng(to);
    setCoords({ fromLatLng: fromCoords, toLatLng: toCoords });
    setShowMap(true);
    // onSearch({ from, to, fromCoords, toCoords });
    setCoordinates({fromCoords, toCoords})
    console.log("Search Bus",fromCoords)

    const distance = haversineDistance(fromCoords, toCoords);
    const route_price = calculatePrice(distance);  // Update price
    if (route_price ) {
      setRoutePrice(route_price)
    }
  };

  return (
    <div className="w-full bg-neutral-50/20 border-1 border-neutral-100 shadow-md rounded-xl py-4 mb-5">

      <form onSubmit={handleSubmit} className="w-full flex flex-col md:flex-row justify-center gap-3 md:gap-5 px-4">
        <div className="flex-1 h-12 border border-neutral-300 bg-white font-medium flex items-center gap-1 rounded-lg p-3">
            <div className="w-5 h-5 text-neutral-400">
              <FaMapMarkerAlt />
            </div>
            <input
              type="text"
              onChange={(e) => setFrom(e.target.value)}
              placeholder="From..."
              className="h-full border-none bg-transparent focus:outline-none"
            />
        </div>

        <div className="flex-1 h-12 border border-neutral-300 bg-white font-medium flex items-center gap-1 rounded-lg p-3">
            <div className="w-5 h-5 text-neutral-400">
              <FaMapMarkerAlt />
            </div>
            <input
              type="text"
              onChange={(e) => setTo(e.target.value)}
              placeholder="To..."
              className="h-full border-none bg-transparent focus:outline-none"
            />
        </div>

        {/* Search Button */}
        <div className="flex justify-center">
          <button 
            type="submit" 
            className="bg-yellow-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-yellow-600 transition"
          >
            <FaSearch /> View
          </button>
        </div>
        </form>
      

        {/* <div className="w-[30%] text-neutral-400 h-12 border border-neutral-300 bg-white font-medium flex items-center gap-1 rounded-lg p-3">
            <input
                type="date"
                className="flex-1 h-full border-none bg-transparent focus:outline-none"
            />
        </div> */}
          
    </div>
  );
};

export default SearchBus;


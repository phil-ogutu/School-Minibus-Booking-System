"use client";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { useTheContext } from "@/context/MapContext";

const SearchBus = ({ defaultFrom, defaultTo }) => {
  const { from, setFrom, to, setTo } = useTheContext();

  return (
    <div className="w-full bg-neutral-50/20 border-1 border-neutral-100 shadow-md rounded-xl py-4 mb-5">
      <div className="w-full flex flex-col md:flex-row justify-center gap-3 md:gap-5 px-4">
        <div className="flex-1 h-12 border border-neutral-300 bg-white font-medium flex items-center gap-1 rounded-lg p-3">
          <div className="w-5 h-5 text-neutral-400">
            <FaMapMarkerAlt />
          </div>
          <input
            type="text"
            onChange={(e) => setFrom(e.target.value)}
            placeholder={defaultFrom || "From..."}
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
            placeholder={defaultTo || "To..."}
            className="h-full border-none bg-transparent focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBus;

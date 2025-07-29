// Here is the Bookings page
"use client";
import dynamic from "next/dynamic";
import SearchCard from "../../components/SearchCard";
import SearchBus from "../../components/SearchBus";
import Navbar from "@/components/Navbar";
import { useTheContext } from "@/context/MapContext";
import { useRoutes } from "@/hooks/useRoutes";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Booking() {
  const { routes, routesLoading, routesError } = useRoutes();
  const { from, to } = useTheContext();

  const router = useRouter();
  const navigateToBuses = (routeId) => {
    router.push(`/bookings/trips/${routeId}`);
  };
  const navigateToPayment = (routeId) =>
    router.push(`/payment?tripId=${routeId}`); // Added payment navigation

  const [stops, setStops] = useState([]);

  const filteredRoutes = routes?.filter((route) => {
    const matchFrom = from
      ? route.start.toLowerCase().includes(from.toLowerCase())
      : true;
    const matchTo = to
      ? route.end.toLowerCase().includes(to.toLowerCase())
      : true;

    return matchFrom && matchTo;
  });

  const displayRoutes =
    filteredRoutes?.length > 0 ? filteredRoutes : routes || [];
  console.log("Filtered routes", filteredRoutes);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 md:grid md:grid-cols-2">
        <div className="p-5 flex flex-col space-y-5">
          <SearchBus />

          <div className="md:grid grid-cols-2 items-start gap-x-5 overflow-y-auto no-scrollbar">
            {displayRoutes.map((route) => (
              <SearchCard
                key={route.id}
                route={route}
                onPreview={() => setStops(route.locations)}
                onSelect={() => navigateToBuses(route.id)}
              />
            ))}
          </div>
        </div>

        <div className="hidden md:block md:w-full md:h-full md:p-2">
          <Map locations={stops} />
        </div>
      </div>
    </div>
  );
}

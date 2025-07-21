// Here is the Bookings page
"use client";
import dynamic from "next/dynamic";
import TopSearchCard from "../../components/SearchCard";
import SearchBus from "../../components/SearchBus";
import Navbar from "@/components/Navbar";
// import MapComponent from "@/components/MapComponent";
import { useTheContext } from "@/context/MapContext";
import { useRoutes } from "@/hooks/useRoutes";

const MapComponent = dynamic(() => import("@/components/MapComponent"), { ssr: false });

export default function Booking() {
  const { routes, routesLoading, routesError } = useRoutes();
  const { from, to } = useTheContext();

  // console.log("FROM", from);
  // console.log("TO", to);

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

      <div className="flex-1 grid grid-cols-2">
        <div className="p-5 flex flex-col space-y-5">
          <SearchBus />

          <div className="overflow-y-auto space-y-4 no-scrollbar h-[calc(100vh-220px)]">

            {displayRoutes.map((route) => (
              <div key={route.id}>
                <TopSearchCard route={route} />
              </div>
            ))}

          </div>
        </div>

        <div className="w-full h-full p-2">
          <MapComponent />
        </div>
      </div>
    </div>
  );
}

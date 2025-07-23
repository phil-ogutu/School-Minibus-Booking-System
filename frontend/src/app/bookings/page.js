// Here is the Bookings page
"use client";
import dynamic from "next/dynamic";
import TopSearchCard from "../../components/SearchCard";
import SearchBus from "../../components/SearchBus";
import Navbar from "@/components/Navbar";
// import MapComponent from "@/components/MapComponent";
import { routesData } from "@/data/RoutesData";
import { useEffect, useState } from "react";
import { useTheContext } from "@/context/MapContext";

const MapComponent = dynamic(() => import("@/components/MapComponent"), { ssr: false });

export default function Booking() {
  const [currentRoutes, setCurrentRoutes] = useState(routesData)
  const { from, to } = useTheContext(); 
  console.log("FROM", from)
  console.log("TO", to)

  console.log(Array.isArray(currentRoutes)) // true if it's an array

  const filteredRoutes = currentRoutes.filter((route) => {
    // return route.id > 0
    // return route.start.toLowerCase().includes(from.toLowerCase())
    // return route.end.toLowerCase().includes(to.toLowerCase())
    const matchFrom = from ? route.start.toLowerCase().includes(from.toLowerCase()) : true;
    const matchTo = to ? route.end.toLowerCase().includes(to.toLowerCase()) : true;

    return matchFrom && matchTo;

  })
  console.log("Filtered routes", filteredRoutes)

  // useEffect(() => {
  //   setCurrentRoutes(routesData)
  // }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 grid grid-cols-2">
        <div className="p-5 flex flex-col space-y-5">
          <SearchBus />
          <div className="overflow-y-auto space-y-4 no-scrollbar h-[calc(100vh-220px)]">

            {(filteredRoutes && filteredRoutes.length>0 ? filteredRoutes:currentRoutes).map((route) => (
              <div key={route.id}>
                <TopSearchCard route={route} />
              </div>
            ))}

            {/* <TopSearchCard /> */}
            {/* <TopSearchCard />
            <TopSearchCard />
            <TopSearchCard /> */}
          </div>
        </div>

        <div className="w-full h-full p-2">
          <MapComponent />
        </div>
      </div>

      {/* <SearchBus /> */}
    </div>
  );
}

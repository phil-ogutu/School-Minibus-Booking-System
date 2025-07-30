// // app/driver/components/SimulatedTrackerMap.jsx
// "use client";

// import { useEffect, useState, useRef } from "react";
// import { MapContainer, TileLayer, Marker, Polyline, Popup, useMapEvents } from "react-leaflet";
// import L from "leaflet";
// import io from "socket.io-client";
// import "leaflet/dist/leaflet.css";
// import { useFetch } from "@/hooks/useFetch";
// import { useParams } from "next/navigation";
// import { FaMapMarkerAlt } from "react-icons/fa";
// import { IoBus } from "react-icons/io5";

// // Initialize socket connection
// const socket = io("http://localhost:5000"); // adjust for production

// // Custom SVG for a school bus icon
// const schoolBusIconSVG = `
//   <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
//     <path d="M21 12h-2V7c0-1.1-.9-2-2-2h-2V4c0-.55-.45-1-1-1H8c-.55 0-1 .45-1 1v1H5c-1.1 0-2 .9-2 2v5H3v2h1v5c0 1.1.9 2 2 2h3v1h6v-1h3c1.1 0 2-.9 2-2v-5h1v-2zm-6 7h-6v-3h6v3zm-2-10H7v-3h10v3zm3 5h-1v5H5v-5H4v-2h16v2z"/>
//   </svg>
// `;

// // Custom icon using DivIcon with the school bus SVG embedded
// const busIcon = new L.DivIcon({
//   className: "custom-bus-icon",
//   html: `<div style="text-align: center;">${schoolBusIconSVG}</div>`,
//   iconSize: [40, 40], // Adjust size to fit in map
//   iconAnchor: [20, 40], // Adjust anchor point to center icon properly
// });

// export default function SimulatedTrackerMap() {
//   const { id: trip_id } = useParams();
//   const [markerPosition, setMarkerPosition] = useState(null);
//   const [locations, setLocations] = useState([]);
//   const [polylineCoords, setPolylineCoords] = useState([]);
//   const [expandedStops, setExpandedStops] = useState(false);

//   // Fetch trip data using useFetch
//   const { data, loading, error } = useFetch(`/api/drivers/1/trip/${trip_id}`, "trip");

//   useEffect(() => {
//     if (data && data.routes && data.routes.locations?.length) {
//       const routePoints = data.routes.locations.map((loc) => [
//         loc.latitude,
//         loc.longitude,
//       ]);
//       setPolylineCoords(routePoints);
//       setLocations(data.routes.locations);
//       setMarkerPosition(routePoints[0]); // Start at the first location
//     }
//   }, [data]);

//   // Distance check to see if bus has reached stop
//   const isCloseTo = (pos1, pos2, threshold = 0.0005) => {
//     const latDiff = Math.abs(pos1[0] - pos2[0]);
//     const lngDiff = Math.abs(pos1[1] - pos2[1]);
//     return latDiff <= threshold && lngDiff <= threshold;
//   };

//   // // Emit location updates to the server when bus reaches a stop
//   // useEffect(() => {
//   //   if (!markerPosition || !locations.length) return;

//   //   locations.forEach((loc) => {
//   //     const locPos = [loc.latitude, loc.longitude];
//   //     if (isCloseTo(markerPosition, locPos)) {
//   //       socket.emit("bus_location_update", { // bus_location_update
//   //         driver_id: 1,
//   //         trip_id,
//   //         latitude: markerPosition[0],
//   //         longitude: markerPosition[1],
//   //         location_name: loc.location_name,
//   //         timestamp: new Date().toISOString(),
//   //       });
//   //       // console.log(" Emitted location for stop:", loc.location_name);
//   //       console.log("Emitted location for bus: LAT:", markerPosition[0], "LONG:", markerPosition[1]);
//   //     }
//   //   });
//   // }, [markerPosition, locations]);

//   // No isCloseTo for smooth emissions
//   useEffect(() => {
//     if (!markerPosition || !locations.length) return;

//     // Emit location update on every change of marker position
//     socket.emit("bus_location_update", {
//       driver_id: 1,
//       trip_id,
//       latitude: markerPosition[0],
//       longitude: markerPosition[1],
//       location_name: "Moving",  // Temporary name for the moving bus
//       timestamp: new Date().toISOString(),
//     });
//     console.log("Emitted location for bus: LAT:", markerPosition[0], "LONG:", markerPosition[1]);
//   }, [markerPosition]);

//   // Draggable marker for bus movement simulation
//   const DraggableMarker = () => {
//     const markerRef = useRef();

//     useMapEvents({
//       dragend: () => {
//         const marker = markerRef.current;
//         if (marker) {
//           const newPos = marker.getLatLng();
//           setMarkerPosition([newPos.lat, newPos.lng]);
//         }
//       },
//     });

//     if (!markerPosition) return null;

//     return (
//       <Marker
//         draggable
//         icon={busIcon}
//         position={markerPosition}
//         eventHandlers={{
//           dragend: (e) => {
//             const newPos = e.target.getLatLng();
//             setMarkerPosition([newPos.lat, newPos.lng]);
//           },
//         }}
//         ref={markerRef}
//       />
//     );
//   };

//   // Show more stops (expand list)
//   const toggleExpandedStops = () => {
//     setExpandedStops(!expandedStops);
//   };

//   // Loading and error handling
//   if (loading) return <p>Loading map...</p>;
//   if (error) return <p>Error loading trip.</p>;
//   if (!markerPosition) return <p>No route loaded yet.</p>;

//   return (
//     <div className="h-[1000px] w-full mt-6" style={{ marginBottom: "50vh" }}>
//       <MapContainer
//         center={markerPosition}
//         zoom={15}
//         scrollWheelZoom={true}
//         style={{ height: "80%", width: "96vw", marginLeft: "2vw", marginRight: "2vw" }}
//       >
//         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
//         {/* Draw Route (Polyline) */}
//         <Polyline positions={polylineCoords} color="blue" />
        
//         {/* Draw each stop as a marker */}
//         {locations.map((loc) => (
//           <Marker
//             key={loc.id}
//             position={[loc.latitude, loc.longitude]}
//             icon={L.divIcon({
//               html: `<div class="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-md">${loc.id}</div>`,
//               className: 'custom-stop-marker',
//             })}
//           >
//             <Popup>{loc.location_name}</Popup>
//           </Marker>
//         ))}
        
//         <DraggableMarker />
//       </MapContainer>

//       {/* Stop List with Expandable View */}
//       <div className="mt-4 text-lg font-semibold" style={{ marginLeft: "2vw", marginRight: "2vw" }}>
//         <h2>Route Stops</h2>
//         <ul className="space-y-2">
//           {locations.slice(1, -1).map((loc, index) => ( // Exclude first and last stop
//             <li
//               key={loc.id}
//               className="flex items-center gap-2 p-2 bg-gray-100 rounded-md"
//             >
//               <FaMapMarkerAlt className="text-purple-600" />
//               <span>{loc.location_name}</span>
//             </li>
//           ))}
//         </ul>

//         {locations.length > 4 && (
//           <div className="text-center mt-3">
//             <button
//               onClick={toggleExpandedStops}
//               className="text-yellow-600 text-sm"
//             >
//               {expandedStops ? "View Less" : "View More"}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import io from "socket.io-client";
import "leaflet/dist/leaflet.css";
import { useFetch } from "@/hooks/useFetch";
import { useParams } from "next/navigation";
import { FaMapMarkerAlt } from "react-icons/fa";
import { IoBus } from "react-icons/io5";

// Custom SVG for a school bus icon
const schoolBusIconSVG = `
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
    <path d="M21 12h-2V7c0-1.1-.9-2-2-2h-2V4c0-.55-.45-1-1-1H8c-.55 0-1 .45-1 1v1H5c-1.1 0-2 .9-2 2v5H3v2h1v5c0 1.1.9 2 2 2h3v1h6v-1h3c1.1 0 2-.9 2-2v-5h1v-2zm-6 7h-6v-3h6v3zm-2-10H7v-3h10v3zm3 5h-1v5H5v-5H4v-2h16v2z"/>
  </svg>
`;

// Custom icon using DivIcon with the school bus SVG embedded
const busIcon = new L.DivIcon({
  className: "custom-bus-icon",
  html: `<div style="text-align: center;">${schoolBusIconSVG}</div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

export default function SimulatedTrackerMap() {
  const { id: trip_id } = useParams();
  const [markerPosition, setMarkerPosition] = useState(null);
  const [locations, setLocations] = useState([]);
  const [polylineCoords, setPolylineCoords] = useState([]);
  const [expandedStops, setExpandedStops] = useState(false);

  const { data, loading, error } = useFetch(`/api/drivers/1/trip/${trip_id}`, "trip");

  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize the socket connection only when the component is mounted
    socketRef.current = io("http://localhost:5000", {
      withCredentials: true,
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to socket server");

      // You can emit initial location or perform any setup here
    });

    return () => {
      socketRef.current.disconnect(); // Clean up the socket connection when the component is unmounted
    };
  }, []);

  useEffect(() => {
    if (data && data.routes && data.routes.locations?.length) {
      const routePoints = data.routes.locations.map((loc) => [
        loc.latitude,
        loc.longitude,
      ]);
      setPolylineCoords(routePoints);
      setLocations(data.routes.locations);
      setMarkerPosition(routePoints[0]); // Start at the first location
    }
  }, [data]);

  // Emit location update when the marker position changes
  useEffect(() => {
    if (!markerPosition || !locations.length || !socketRef.current) return;

    // Emit the bus location update to the server (driver_location_update or bus_location_update or both)
    socketRef.current.emit("driver_location_update", {
      driver_id: 1,
      trip_id,
      latitude: markerPosition[0],
      longitude: markerPosition[1],
      location_name: "Moving",  // Temporary name for the moving bus
      speed: 15,  // Temporary 
      timestamp: new Date().toISOString(),
    });

    console.log("Emitted location for bus: LAT:", markerPosition[0], "LONG:", markerPosition[1]);
  }, [markerPosition]);

  const isCloseTo = (pos1, pos2, threshold = 0.0005) => {
    const latDiff = Math.abs(pos1[0] - pos2[0]);
    const lngDiff = Math.abs(pos1[1] - pos2[1]);
    return latDiff <= threshold && lngDiff <= threshold;
  };

  const DraggableMarker = () => {
    const markerRef = useRef();

    useMapEvents({
      dragend: () => {
        const marker = markerRef.current;
        if (marker) {
          const newPos = marker.getLatLng();
          setMarkerPosition([newPos.lat, newPos.lng]);
        }
      },
    });

    if (!markerPosition) return null;

    return (
      <Marker
        draggable
        icon={busIcon}
        position={markerPosition}
        eventHandlers={{
          dragend: (e) => {
            const newPos = e.target.getLatLng();
            setMarkerPosition([newPos.lat, newPos.lng]);
          },
        }}
        ref={markerRef}
      />
    );
  };

  const toggleExpandedStops = () => {
    setExpandedStops(!expandedStops);
  };

  if (loading) return <p>Loading map...</p>;
  if (error) return <p>Error loading trip.</p>;
  if (!markerPosition) return <p>No route loaded yet.</p>;

  return (
    <div className="h-[1000px] w-full mt-6" style={{ marginBottom: "50vh" }}>
      <MapContainer
        center={markerPosition}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: "80%", width: "96vw", marginLeft: "2vw", marginRight: "2vw" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Polyline positions={polylineCoords} color="blue" />

        {locations.map((loc) => (
          <Marker
            key={loc.id}
            position={[loc.latitude, loc.longitude]}
            icon={L.divIcon({
              html: `<div class="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-md">${loc.id}</div>`,
              className: "custom-stop-marker",
            })}
          >
            <Popup>{loc.location_name}</Popup>
          </Marker>
        ))}
        
        <DraggableMarker />
      </MapContainer>

      {/* Stop List with Expandable View */}
      <div className="mt-4 text-lg font-semibold" style={{ marginLeft: "2vw", marginRight: "2vw" }}>
        <h2>Route Stops</h2>
        <ul className="space-y-2">
          {locations.slice(1, -1).map((loc, index) => (
            <li key={loc.id} className="flex items-center gap-2 p-2 bg-gray-100 rounded-md">
              <FaMapMarkerAlt className="text-purple-600" />
              <span>{loc.location_name}</span>
            </li>
          ))}
        </ul>

        {locations.length > 4 && (
          <div className="text-center mt-3">
            <button onClick={toggleExpandedStops} className="text-yellow-600 text-sm">
              {expandedStops ? "View Less" : "View More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

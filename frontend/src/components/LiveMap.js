// import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
// import { useEffect, useState } from 'react';
// import L from 'leaflet';

// // Custom icon for the bus
// const busIcon = new L.Icon({
//   iconUrl: '/bus-icon.png', // Make sure you have a custom bus icon image, or use a default one
//   iconSize: [32, 32],
//   iconAnchor: [16, 32],
//   popupAnchor: [0, -32]
// });

// export default function LiveMap({ driverLocation, routeLocations }) {
//   const [busPosition, setBusPosition] = useState([driverLocation?.latitude || 0, driverLocation?.longitude || 0]);
//   const [route, setRoute] = useState(routeLocations);

//   useEffect(() => {
//     if (driverLocation) {
//       setBusPosition([driverLocation.latitude, driverLocation.longitude]);
//     }
//   }, [driverLocation]);

//   return (
//     <MapContainer center={busPosition} zoom={13} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//       />
//       {/* Bus marker */}
//       {driverLocation && (
//         <Marker position={busPosition} icon={busIcon}>
//           <Popup>Bus Location: {driverLocation.checkpoint}</Popup>
//         </Marker>
//       )}

//       {/* Route Polyline */}
//       {route && route.length > 0 && (
//         <Polyline positions={route.map(stop => [stop.latitude, stop.longitude])} color="blue" />
//       )}
//     </MapContainer>
//   );
// }


import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';

// Custom icon for the bus
const busIcon = new L.Icon({
  iconUrl: '/bus-icon.png', // Make sure you have a custom bus icon image, or use a default one
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

export default function LiveMap({ driverLocation, routeLocations }) {
  const [busPosition, setBusPosition] = useState([driverLocation?.latitude || 0, driverLocation?.longitude || 0]);
  const [route, setRoute] = useState(routeLocations);

  useEffect(() => {
    if (driverLocation) {
      setBusPosition([driverLocation.latitude, driverLocation.longitude]);
    }
  }, [driverLocation]);

  return (
    <div className="map-container" style={{ position: 'relative', width: '100%', height: '500px' }}>
      <MapContainer 
        center={busPosition} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }} 
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Bus marker */}
        {driverLocation && (
          <Marker position={busPosition} icon={busIcon}>
            <Popup>Bus Location: {driverLocation.checkpoint}</Popup>
          </Marker>
        )}

        {/* Route Polyline */}
        {route && route.length > 0 && (
          <Polyline 
            positions={route.map(stop => [stop.latitude, stop.longitude])} 
            color="blue" 
          />
        )}
      </MapContainer>
    </div>
  );
}

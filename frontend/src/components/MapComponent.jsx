import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useTheContext } from "@/context/MapContext";

const MapComponent = ({
  from = { lat: -1.286389, lng: 36.817223 },
  to = { lat: -0.0917, lng: 34.768 },
}) => {
  const { coordinates } = useTheContext();
//   console.log("Map Component", coordinates);

  const fromCoords = coordinates?.fromCoords || from;
  const toCoords = coordinates?.toCoords || to;

  const center = [fromCoords.lat, fromCoords.lng];
  const positions = [
    [fromCoords.lat, fromCoords.lng],
    [toCoords.lat, toCoords.lng],
  ];
  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "700px", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[fromCoords.lat, fromCoords.lng]} />
      <Marker position={[toCoords.lat, toCoords.lng]} />
      <Polyline positions={positions} color="blue" />
    </MapContainer>
  );
};

export default MapComponent;

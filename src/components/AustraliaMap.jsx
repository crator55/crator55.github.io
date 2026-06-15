import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMemo } from "react";
import FacilityPopup from "./FacilityPopup";

// Fix for missing marker icons in React/Vite
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function createColoredIcon(color) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
      <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 21.9 12.5 41 12.5 41S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0z" fill="${color}" stroke="#333" stroke-width="1"/>
      <circle cx="12.5" cy="12.5" r="5" fill="#fff"/>
    </svg>`;
  return L.icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svg)}`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
}

const defaultIcon = createColoredIcon("#3b82f6");

function AustraliaMap({ locations, statusColors = [] }) {
  const iconMap = useMemo(() => {
    const map = {};
    statusColors.forEach(({ label, color }) => {
      map[label.toLowerCase()] = createColoredIcon(color);
    });
    return map;
  }, [statusColors]);

  function getIcon(status) {
    return iconMap[status.toLowerCase()] || defaultIcon;
  }

  return (
    <MapContainer
      center={[-37.0, 144.5]}
      zoom={7}
      scrollWheelZoom={true}
      style={{
        height: "90vh",
        width: "100%",
      }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.latitude, location.longitude]}
          icon={getIcon(location.status)}
        >
          <Popup>
            <FacilityPopup location={location} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default AustraliaMap;
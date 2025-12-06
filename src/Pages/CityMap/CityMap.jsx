import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Move map to searched location
function FlyToLocation({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 16, { duration: 1.5 });
    }
  }, [position]);
  return null;
}

export default function CityMap() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  // Inject Leaflet CSS automatically
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
  }, []);

  // Fix marker icons
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  // Handle Search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery} dhaka`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.length > 0) {
      setSearchResult({
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        display_name: data[0].display_name,
      });
    }
  };

  return (
    <div className="w-full py-16 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-6">
         City Map – Search Places
      </h2>

      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search places in Dhaka…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border rounded-l-lg w-64 focus:ring focus:outline-none"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 cursor-pointer text-white rounded-r-lg"
        >
          Search
        </button>
      </div>

      {/* Map */}
      <div className="w-full h-[500px] rounded-xl shadow-lg overflow-hidden">
        <MapContainer
          center={[23.8103, 90.4125]}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Default Dhaka Pin (when no search) */}
          {!searchResult && (
            <Marker position={[23.8103, 90.4125]}>
              <Popup>Dhaka City (Default)</Popup>
            </Marker>
          )}

          {/* Auto move map + result pin */}
          {searchResult && (
            <>
              <FlyToLocation position={[searchResult.lat, searchResult.lon]} />
              <Marker position={[searchResult.lat, searchResult.lon]}>
                <Popup>{searchResult.display_name}</Popup>
              </Marker>
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
}

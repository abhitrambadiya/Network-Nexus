import React, { useState, useEffect, useRef, useCallback } from 'react';
import "leaflet/dist/leaflet.css";
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

// Fix default marker icons
L.Marker.prototype.options.icon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// 2. Create a separate MapComponent to prevent re-initialization
const MapComponent = () => {
  const mapRef = useRef(null);
  const [alumniLocations, setAlumniLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.remove(); // Destroys the map instance
      mapRef.current = null;
    }
    const fetchAlumniData = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/alumni-map');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setAlumniLocations(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumniData();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove(); // Destroy the map instance on unmount
        mapRef.current = null;
      }
    };
  }, []);

  const getAvatarUrl = useCallback((name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
  }, []);
  

  if (loading) return <div>Loading map data...</div>;
  if (error) return <div className="text-red-500">Failed to load map data. Please try again.</div>;

  return (
    <div style={{ height: "500px", width: "100%" }}>
    {!mapRef.current && ( // Only render MapContainer if not already initialized
    <MapContainer 
      center={[20, 0]} 
      zoom={2} 
      style={{ height: "500px", width: "100%" }}
      whenCreated={(map) => {
        if (!mapRef.current) {
          mapRef.current = map; // Store the map instance
        }
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {alumniLocations.filter(loc => loc.position && loc.position[0] && loc.position[1])
        .map((location, index) => (
        // Inside your MapComponent return statement, replace just the Popup portion
<Marker key={index} position={location.position}>
  <Popup>
    <div className="w-64 p-2 bg-white rounded border border-gray-200 shadow-md">
      {/* Location header - simplified */}
      <div className="flex items-center justify-between mb-2 pb-1 border-b border-gray-100">
        <div className="flex items-center text-xs text-gray-700">
          <svg className="w-3 h-3 mr-1 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-medium">{location.location}</span>
        </div>
        <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-xs font-medium bg-indigo-100 text-indigo-800">
          {location.alumniCount}
        </span>
      </div>

      {/* Alumni list - horizontal layout with limited height */}
      <div className="max-h-40 overflow-y-auto">
        {location.alumni.map((alum, i) => (
          <div key={i} className={`flex items-center py-1 ${i > 0 ? 'border-t border-gray-50' : ''}`}>
            <img 
              src={getAvatarUrl(alum.fullName)}
              alt={alum.fullName}
              className="w-8 h-8 rounded-full border border-indigo-300 mr-2"
              loading="lazy"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-800 truncate">{alum.fullName}</h3>
              <div className="flex items-center text-xs text-gray-500">
                <span className="truncate">{alum.jobPosition}</span>
                <span className="mx-1">•</span>
                <span className="truncate">{alum.companyName}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </Popup>
</Marker>
      ))}
    </MapContainer>
  )}
  </div>
  );
};

export default MapComponent;
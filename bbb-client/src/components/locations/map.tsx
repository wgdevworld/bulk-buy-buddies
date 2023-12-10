"use client";

import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Location } from "./locations";

// Define the container style for the Google Map
const containerStyle = {
  width: "100%",
  height: "100%",
};

// Define custom map styles
const mapStyles = [
  {
    featureType: "all",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "all",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#000000",
      },
    ],
  },
];

// Define the prop types for the MapComponent component
interface MapComponentProps {
  center: { lat: number; lng: number };
  setCenter: React.Dispatch<React.SetStateAction<{ lat: number; lng: number }>>;
  selectedLocation: Location;
}

// Define the MapComponent component
function MapComponent({
  center,
  // setCenter,
  selectedLocation,
}: MapComponentProps) {
  console.log("MapComponent - selectedLocation:", selectedLocation);

  // Load Google Maps using the useJsApiLoader hook
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey:
      process.env.GOOGLE_MAPS_API_KEY ||
      "AIzaSyAc_M-Qxm_gfgUxldg45z9cDJ7uosPP9VA",
  });

  // Render the open hours for the selected location
  const renderOpenHours = () => {
    return selectedLocation.openHours.map((timeSlot, index) => (
      <div key={index}>
        <strong>{timeSlot.dayOfWeek}:</strong> {timeSlot.openTime} - {timeSlot.endTime}
      </div>
    ));
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }
  if (!isLoaded) {
    return <div>Loading Maps...</div>;
  }

  return (
    <div className="map-container relative">
      {isLoaded ? (
        // Render the Google Map component
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
          options={{
            styles: mapStyles,
          }}
        >
          {selectedLocation && (
            // Render a marker for the selected location on the map
            <Marker
              position={{
                lat: selectedLocation.coordinates[1],
                lng: selectedLocation.coordinates[0],
              }}
              options={{ icon: "/marker-icon.png" }} // Customize the marker icon
            />
          )}

          {/* Location Card */}
          <div className="location-card bg-blue absolute top-0 left-0 m-4 p-4 rounded-lg shadow-lg z-10">
            <h1 className="text-2xl font-semibold text-black">{selectedLocation.name}</h1>
            <p className="text-black">{selectedLocation.address}</p>
            <div className="mt-4 space-y-2">{renderOpenHours()}</div>
            {/* You can add more information here */}
          </div>
        </GoogleMap>
      ) : (
        <div className="text-blue-800">Loading Maps...</div>
      )}
    </div>
  );
}

export default MapComponent;

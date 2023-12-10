// locationcard.tsx
import React from "react";
import { Location } from "./locations";

// Define the prop types for the LocationCard component
interface LocationCardProps {
  selectedLocation: Location;
}

// Define the LocationCard component
function LocationCard({ selectedLocation }: LocationCardProps) {
  console.log("LocationCard - selectedLocation:", selectedLocation);

  // Render the open hours for the selected location
  const renderOpenHours = () => {
    return selectedLocation.openHours.map((timeSlot, index) => (
      <div key={index}>
        <strong>{timeSlot.dayOfWeek}:</strong> {timeSlot.openTime} - {timeSlot.endTime}
      </div>
    ));
  };

  return (
    <div className="location-card bg-blue-200 m-8 p-4 rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold text-blue-800">{selectedLocation.name}</h1>
      <p className="text-blue-600">{selectedLocation.address}</p>
      <div className="mt-4 space-y-2">
        {renderOpenHours()}
      </div>
    </div>
  );
}

export default LocationCard;

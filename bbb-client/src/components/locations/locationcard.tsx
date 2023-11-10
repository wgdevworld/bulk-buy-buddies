// locationcard.tsx
import React from "react";
import { Location } from "./locations";

interface LocationCardProps {
  selectedLocation: Location;
}

function LocationCard({ selectedLocation }: LocationCardProps) {
  console.log("LocationCard - selectedLocation:", selectedLocation);

  const renderOpenHours = () => {
    return selectedLocation.openHours.map((timeSlot, index) => (
      <div key={index}>
        <strong>{timeSlot.dayOfWeek}:</strong> {timeSlot.openTime} - {timeSlot.endTime}
      </div>
    ));
  };

  return (
    <div className="location-card">
      <h1 className="location-title">{selectedLocation.name}</h1>
      <p className="location-address">{selectedLocation.address}</p>
      <div className="location-hours">
        {renderOpenHours()}
      </div>
      {/* You can add more information here */}
    </div>
  );
}

export default LocationCard;

"use client";

import React, { useState } from "react";
import { Location } from "./locations";

interface LocationsDropdownProps {
  locations: Location[];
  onSelectLocation: (location: Location) => void;
  selectedLocation: Location;
}

export default function LocationsDropdown({
  locations,
  onSelectLocation,
  selectedLocation,
}: LocationsDropdownProps) {
  const [localSelectedLocation, setLocalSelectedLocation] = useState<Location | null>(selectedLocation);

  const handleLocationSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    const selectedLocation = locations.find(location => location.name === selectedName);

    if (selectedLocation) {
      // Update the localSelectedLocation state
      setLocalSelectedLocation(selectedLocation);

      onSelectLocation(selectedLocation);
    }
  };

  // return (
  //   <div className="locations-dropdown">
  //     <select onChange={handleLocationSelect} value={localSelectedLocation?.name || ""}>
  //       <option value="">Select a location</option>
  //       {locations.map((location) => (
  //         <option key={location.lid} value={location.name}>
  //           {location.name}
  //         </option>
  //       ))}
  //     </select>
  //   </div>
  // );
  return (
    <div className="locations-dropdown">
      <select
        onChange={handleLocationSelect}
        value={localSelectedLocation?.name || ""}
        className="bg-white border border-blue-600 rounded px-4 py-2 text-blue-900"
      >
        <option value="">Select a location</option>
        {locations.map((location) => (
          <option key={location.lid} value={location.name}>
            {location.name}
          </option>
        ))}
      </select>
    </div>
  );
  
}

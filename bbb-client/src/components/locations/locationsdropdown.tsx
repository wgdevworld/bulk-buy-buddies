"use client";

import React, { useState } from "react";
import { Location } from "./locations";

// Define the prop types for the LocationsDropdown component
interface LocationsDropdownProps {
  locations: Location[];
  onSelectLocation: (location: Location) => void;
  selectedLocation: Location;
}

// Define the LocationsDropdown component
export default function LocationsDropdown({
  locations,
  onSelectLocation,
  selectedLocation,
}: LocationsDropdownProps) {
  // Define local state for the selected location
  const [localSelectedLocation, setLocalSelectedLocation] = useState<Location | null>(selectedLocation);

  // Function to handle location selection from the dropdown
  const handleLocationSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    const selectedLocation = locations.find(location => location.name === selectedName);

    if (selectedLocation) {
      // Update the localSelectedLocation state
      setLocalSelectedLocation(selectedLocation);

      // Call the onSelectLocation callback to notify the parent component of the selection
      onSelectLocation(selectedLocation);
    }
  };

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

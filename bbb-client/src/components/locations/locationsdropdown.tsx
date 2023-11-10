// locationsdropdown.tsx
import React from "react";
import { Location } from "./locations";

interface LocationsDropdownProps {
  locations: Location[];
  onSelectLocation: (location: Location) => void;
}

const LocationsDropdown: React.FC<LocationsDropdownProps> = ({ locations, onSelectLocation }) => {
  return (
    <div className="locations-dropdown">
      <select onChange={(e) => onSelectLocation(locations[Number(e.target.value)])}>
        <option value="">Select a location</option>
        {locations.map((location, index) => (
          <option key={location.lid} value={index}>
            {location.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocationsDropdown;

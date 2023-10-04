import React, { useState, useEffect } from "react";
import "./Locations.css"

export interface Location {
  _id: string;
  name: string;
  address: string;
  location: {
    type: string;
    coordinates: number[];    
  };
  openHours: {
    dayOfWeek: string;
    openTime: string;
    closeTime: string;
  }[];
}

// Display Locations 
function Locations() {
  const [locations, setLocations] = useState<Location[]>([]);
  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/get_locations');
      const data = await response.json();
      setLocations(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      {locations.map(location => (
        <div key={location._id}>
          <h2>{location.address}</h2>
          {/* <p>
            Latitude: {location.location.coordinates[0]} 
            Longitude: {location.location.coordinates[1]}
          </p> */}
          <h3>Opening Hours:</h3>
          <ul>
            {location.openHours.map(hours => (
              <li key={hours.dayOfWeek}>
                {hours.dayOfWeek}: {hours.openTime} - {hours.closeTime}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Locations;
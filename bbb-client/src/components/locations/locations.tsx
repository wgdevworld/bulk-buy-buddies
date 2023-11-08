import React, { useState, useEffect } from "react";
import "./locations.css"
import MapComponent from "./map";


export interface Location {
  _id: string;
  name: string;
  address: string;
  coordinates: number[];    
  openHours: {
    dayOfWeek: string;
    openTime: string;
    endTime: string;
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
      console.log(data);
      setLocations(data);
    } catch (error) {
      console.error(error);
    }
  }

  const [mapCenter, setMapCenter] = useState({lat: 36.028848, lng: -78.915528});

  return (
    <div className="locations">
      <h1 className="location-title">Costco Locations</h1>
      <div className="map-container">
        <MapComponent center={mapCenter} setCenter={setMapCenter}/>
      </div>
      <div className="locations-container">
        {locations.map(location => (
          <div className="locations-list" key={location._id} onClick={() => setMapCenter({lat:location.coordinates[1], lng:location.coordinates[0]})}>
              <h1>{location.name}</h1>
              <h2>{location.address}</h2>
              <h3>Opening Hours:</h3>
              <ul>
                {location.openHours.map(hours => (
                  <li key={hours.dayOfWeek}>
                    {hours.dayOfWeek}: {hours.openTime} - {hours.endTime} 
                  </li>
                ))}
              </ul>
          </div>
        ))}
        </div>

    </div>
  );
}

export default Locations;




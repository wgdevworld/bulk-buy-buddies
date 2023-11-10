// locations.tsx
import React, { useState, useEffect } from "react";
import "./locations.css";
import MapComponent from "./map";
import LocationsDropdown from "./locationsdropdown";

export interface Location {
  lid: number;
  name: string;
  address: string;
  coordinates: number[];
  openHours: {
    dayOfWeek: string;
    openTime: string;
    endTime: string;
  }[];
}


function calculateDistance(coord1: number[], coord2: number[]): number {
  const [lat1, lng1] = coord1;
  const [lat2, lng2] = coord2;

  const radLat1 = Math.PI * lat1/180;
  const radLat2 = Math.PI * lat2/180;
  const theta = lng1 - lng2;
  const radTheta = Math.PI * theta/180;

  let distance = Math.sin(radLat1) * Math.sin(radLat2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);
  if (distance > 1) {
    distance = 1;
  } else if (distance < -1) {
    distance = -1;
  }

  distance = Math.acos(distance);
  distance = distance * 180/Math.PI;
  distance = distance * 60 * 1.1515;

  distance = distance * 1.609344;

  return distance;
}



function Locations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 36.028848, lng: -78.915528 }); 
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  useEffect(() => {
    fetchLocations();
    fetchUserLocation();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/get_locations");
      const locationsData = await response.json();
      setLocations(locationsData);
    } catch (error) {
      console.error("An error occurred while fetching locations:", error);
      setLocations([]); 
    }
  };
  
  const fetchUserLocation = async () => {
    try {
      const acctResponse = await fetch('http://127.0.0.1:5000/users/get_acct_info');
      const acctData = await acctResponse.json();
      const userId = acctData.uid; 
  
      const locationResponse = await fetch(`http://127.0.0.1:5000/locations/get_user_location/${userId}`);
      const userLocation = await locationResponse.json();
      if (locations.length > 0) {
        const nearestLocation = findNearestLocation(userLocation, locations);
        setMapCenter({ lat: nearestLocation.coordinates[1], lng: nearestLocation.coordinates[0] });
        setSelectedLocation(nearestLocation);
      }
    } catch (error) {
      console.error("Error fetching user information:", error);
      setMapCenter({ lat: 36.028848, lng: -78.915528 }); 
    }
  };
  
  
  


  function findNearestLocation(userLocation: number[], locations: Location[]): Location {
    let nearestLocation = locations[0];
    let shortestDistance = calculateDistance(userLocation, nearestLocation.coordinates);

    for (const location of locations) {
      const distance = calculateDistance(userLocation, location.coordinates);
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestLocation = location;
      }
    }

    return nearestLocation;
  }


  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setMapCenter({ lat: location.coordinates[1], lng: location.coordinates[0] });
  };

  return (
    <div className="locations">
      <h1 className="location-title">Choose your Costco warehouse</h1>
      <div className="locations-container">
        <LocationsDropdown locations={locations} onSelectLocation={handleLocationSelect} />
      </div>
      <div className="map-container">
        <MapComponent center={mapCenter} setCenter={setMapCenter} selectedLocation={selectedLocation} />
      </div>
    </div>
  );
}


export default Locations;
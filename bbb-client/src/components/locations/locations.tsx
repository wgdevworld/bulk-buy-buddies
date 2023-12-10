"use client";

import React, { useState, useEffect } from "react";
import "./locations.css";
import MapComponent from "./map";
import LocationsDropdown from "./locationsdropdown";
import UnmatchedRequests from "./unmatchedrequests";

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

const placeholderLocation = {
  lid: 0,
  name: "Loading your nearest Location...",
  address: "",
  coordinates: [0, 0],
  openHours: [],
};

interface LocationsProps {
  onSelectLocation: (location: Location) => void;
}

// Function to calculate the distance between two sets of coordinates
function calculateDistance(coord1: number[], coord2: number[]): number {
  const [lat1, lng1] = coord1;
  const [lat2, lng2] = coord2;

  const radLat1 = (Math.PI * lat1) / 180;
  const radLat2 = (Math.PI * lat2) / 180;
  const theta = lng1 - lng2;
  const radTheta = (Math.PI * theta) / 180;

  let distance =
    Math.sin(radLat1) * Math.sin(radLat2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);
  if (distance > 1) {
    distance = 1;
  } else if (distance < -1) {
    distance = -1;
  }

  distance = Math.acos(distance);
  distance = (distance * 180) / Math.PI;
  distance = distance * 60 * 1.1515;
  distance = distance * 1.609344;

  return distance;
}

function Locations({ onSelectLocation }: LocationsProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] =
    useState<Location>(placeholderLocation);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 36.028848,
    lng: -78.915528,
  });

  useEffect(() => {
    // Fetch the list of locations when the component mounts
    const fetchData = async () => {
      await fetchLocations();
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Fetch the user's location when the locations list changes
    if (locations.length > 0) {
      fetchUserLocation();
    }
  }, [locations]);

  // Function to fetch the list of locations from the server
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

  // Function to fetch the user's location and find the nearest location
  const fetchUserLocation = async () => {
    try {
      // Fetch user account information
      const acctResponse = await fetch("http://127.0.0.1:5000/get_acct_info");
      const acctData = await acctResponse.json();
      const userId = acctData.uid;

      // Fetch user's location
      const locationResponse = await fetch(
        `http://127.0.0.1:5000/get_user_location/${userId}`
      );
      const userLocation = await locationResponse.json();
      console.log("user location: ", userLocation);

      if (locations.length > 0) {
        // Find the nearest location based on user's coordinates
        const nearestLocation = findNearestLocation(
          [userLocation.lng, userLocation.lat],
          locations
        );
        setMapCenter({
          lat: nearestLocation.coordinates[1],
          lng: nearestLocation.coordinates[0],
        });
        setSelectedLocation(nearestLocation);
        onSelectLocation(nearestLocation);
      }
    } catch (error) {
      console.error("Error fetching user information:", error);
    }
  };

  // Function to find the nearest location based on user coordinates
  function findNearestLocation(
    userLocation: number[],
    locations: Location[]
  ): Location {
    let nearestLocation = locations[0];
    let shortestDistance = calculateDistance(
      userLocation,
      nearestLocation.coordinates
    );

    for (const location of locations) {
      const distance = calculateDistance(userLocation, location.coordinates);
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestLocation = location;
      }
    }
    return nearestLocation;
  }

  // Handle location selection
  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setMapCenter({
      lat: location.coordinates[1],
      lng: location.coordinates[0],
    });
    onSelectLocation(location);
  };

  return (
    <div className="min-h-screen">
      <div className="flex flex-col justify-center items-center py-20">
        <h1 className="text-3xl font-bold text-blue-900 mb-8">
          Choose your Costco warehouse
        </h1>
        <LocationsDropdown
          locations={locations}
          onSelectLocation={handleLocationSelect}
          selectedLocation={selectedLocation}
        />
        <div className="map-container">
          <MapComponent
            center={mapCenter}
            setCenter={setMapCenter}
            selectedLocation={selectedLocation}
          />
        </div>
        {selectedLocation.lid !== 0 && (
          <UnmatchedRequests locationId={selectedLocation.lid} />
        )}
      </div>
    </div>
  );
}

export default Locations;

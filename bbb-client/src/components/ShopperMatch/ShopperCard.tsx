/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import "./ShopperCard.css";
import { useRouter, useSearchParams } from "next/navigation";

interface ShopperCardProps {
  userID: string;
  category: string;
  quantity: number;
  location: number;
  timeStart: Date;
  timeEnd: Date;
  matchScore: number;
  reqID: string;
  currentReqID: string | null;
  //   status: boolean;
}

export default function ShopperCard({
  userID,
  category,
  quantity,
  location,
  timeStart,
  timeEnd,
  matchScore,
  reqID,
  currentReqID,
}: ShopperCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentUserID = searchParams.get("userID");

  const [locationName, setLocationName] = useState<string | undefined>("");

  const query = {
    userReqID: currentReqID,
    buddyReqId: reqID,
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchLocationName(location);
    };
    fetchData();
  }, []);

  const createQueryString = (query: object) => {
    const params = new URLSearchParams();
    for (const [name, value] of Object.entries(query)) {
      params.set(name, value);
    }
    return params.toString();
  };

  const fetchLocationName = async (location: number) => {
    console.log("fetchLocations is being called");
    try {
      const response = await fetch(
        `http://127.0.0.1:5000//get_location_name/${location}`
      );
      const locationsData = await response.json();

      if (locationsData.error) {
        console.error("Error fetching location name:", locationsData.error);
        setLocationName("Error fetching location");
      } else {
        setLocationName(locationsData);
        console.log("Locations fetched:", locationsData);
      }
    } catch (error) {
      console.error("An error occurred while fetching locations:", error);
      setLocationName("Error fetching location");
    }
  };

  return (
    <div className="card">
      <h2>Current UserID: {currentUserID}</h2>
      <h2>UserID: {userID}</h2>
      <h2>ReqID: {reqID}</h2>
      <p>Shopping for {category}</p>
      <p>at {locationName}</p>
      <p>Quantity: {quantity}</p>
      <p>Start time: {new Date(timeStart).toLocaleString()}</p>
      <p>End time: {new Date(timeEnd).toLocaleString()}</p>
      <p>Match Score: {matchScore}%</p>
      <div className="button-container">
        <button
          className="button"
          onClick={() =>
            router.push("/productRec" + "?" + createQueryString(query))
          }
        >
          Select Buddy
        </button>
      </div>
    </div>
  );
}
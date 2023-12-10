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
    <div className="card p-4 border rounded-md shadow-md mb-4 bg-white relative">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col justify-between">
          <p className="text-lg mb-2">
            Shopping for <span className="font-bold">{category}</span> at{" "}
            <span className="font-bold">{locationName}</span>
          </p>
          <p className="text-lg mb-2">Quantity: {quantity}</p>
          <p className="text-lg mb-2">
            Start time: {new Date(timeStart).toLocaleString()}
          </p>
          <p className="text-lg mb-2">
            End time: {new Date(timeEnd).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-col justify-between items-end mt-auto">
          <span className="bg-blue-500 text-white px-4 py-3 text-xl mt-2 font-bold rounded-full">
            {matchScore}% Match!
          </span>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 mb-4 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300 relative overflow-hidden"
            onClick={() =>
              router.push("/productRec" + "?" + createQueryString(query))
            }
          >
            Select Buddy
          </button>
        </div>
      </div>
    </div>
  );
}

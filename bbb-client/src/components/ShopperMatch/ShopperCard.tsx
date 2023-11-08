/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React from "react";
import "./ShopperCard.css";
import { useRouter, useSearchParams } from "next/navigation";

interface ShopperCardProps {
  //   reqID: string;
  userID: string;
  category: string;
  quantity: number;
  location: string;
  timeStart: Date;
  timeEnd: Date;
  //   status: boolean;
}

export default function ShopperCard({
  userID,
  category,
  quantity,
  location,
  timeStart,
  timeEnd,
}: ShopperCardProps) {
  const router = useRouter();
  const query = {
    userID: userID,
    userCategory: category,
    userQuantity: 3, // add current user's quantity later
    buddyQuantity: quantity,
    location: "Durham",
  };

  const createQueryString = (query: object) => {
    const params = new URLSearchParams();
    for (const [name, value] of Object.entries(query)) {
      params.set(name, value);
    }
    return params.toString();
  };

  return (
    <div className="card">
      {/* userD corresponds to username */}
      <h2>UserID: {userID}</h2>
      <p>
        Shopping for {category} at {location}
      </p>
      {/* <p>Category: {category}</p> */}
      <p>Quantity: {quantity}</p>
      <p>Start time: {timeStart.toLocaleString()}</p>
      <p>End time: {timeEnd.toLocaleString()}</p>
      {/* <p>Location: {location}</p> */}
      <div className="button-container">
        <button
          className="button"
          onClick={() =>
            router.push("productRec" + "?" + createQueryString(query))
          }
        >
          Select Buddy
        </button>
        <button className="button">Learn More</button>
      </div>
    </div>
  );
}

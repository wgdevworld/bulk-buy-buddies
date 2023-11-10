/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React from "react";
import "./ShopperCard.css";
import { useRouter } from "next/navigation";

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
    location: 249,
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
      <h2>UserID: {userID}</h2>
      <p>
        Shopping for {category} at {location}
      </p>
      <p>Quantity: {quantity}</p>
      <p>Start time: {new Date(timeStart).toLocaleString()}</p>
      <p>End time: {new Date(timeEnd).toLocaleString()}</p>
      <div className="button-container">
        <button className="button">Select Buddy</button>
        <button
          className="button"
          onClick={() =>
            router.push("/productRec" + "?" + createQueryString(query))
          }
        >
          Learn More
        </button>
      </div>
    </div>
  );
}

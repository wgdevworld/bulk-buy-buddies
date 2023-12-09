/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React from "react";
import "./ShopperCard.css";
import { useRouter, useSearchParams } from "next/navigation";

interface ShopperCardProps {
  userID: string;
  category: string;
  quantity: number;
  location: string;
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

  const query = {
    userReqID: currentReqID,
    buddyReqId: reqID,
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
      <h2>Current UserID: {currentUserID}</h2>
      <h2>UserID: {userID}</h2>
      <h2>ReqID: {reqID}</h2>
      <p>Shopping for {category}</p>
      {/* <p>at {location}</p> */}
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

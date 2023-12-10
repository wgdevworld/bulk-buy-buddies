"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import ShopperCard from "./ShopperCard";
import { useRouter, useSearchParams } from "next/navigation";
import { calculateMatchScore } from "./MatchScore";

export interface ShoppingForm {
  reqID: string;
  userID: string;
  category: string;
  quantity: number;
  location: number;
  timeStart: Date;
  timeEnd: Date;
  status: string;
}

function ShopperMatch() {
  const router = useRouter();
  const [requests, setRequests] = useState<ShoppingForm[]>([]);

  const searchParams = useSearchParams();
  const currentUserID = searchParams.get("userID");
  const currentCategory = searchParams.get("category");
  const currentQuantity = searchParams.get("quantity");
  const currentLocation = searchParams.get("location");
  const currentTimeStart = searchParams.get("timeStart");
  const currentTimeEnd = searchParams.get("timeEnd");
  const currentReqID = searchParams.get("reqID");
  const parseLocation = Number(currentLocation);

  useEffect(() => {
    fetchMyRequests(currentUserID);
  }, []);

  const fetchMyRequests = async (currentUserID: string | null) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/get-match-requests?userID=${currentUserID}`
      );
      const data = await response.json();
      console.log(data);
      const sortedRequest = data.sort(
        (a: ShoppingForm, b: ShoppingForm) =>
          calculateMatchScore(
            currentCategory,
            parseLocation,
            currentTimeStart,
            currentTimeEnd,
            b
          ) -
          calculateMatchScore(
            currentCategory,
            parseLocation,
            currentTimeStart,
            currentTimeEnd,
            a
          )
      );
      setRequests(data);
    } catch (error) {
      console.error(error);
      setRequests([]);
    }
  };

  return (
    <>
      <div className="text-center mt-4">
        <h1 className="font-bold text-3xl">Recommended Bulk Buy Buddies</h1>
        <div className="text-lg">
          Shoppers we recommend you match with based on your preference.
        </div>
      </div>
      {/* <h1>Current UserID: {currentUserID}</h1>
      <div>Current reqID: {currentReqID}</div>
      <div>Current Category: {currentCategory}</div>
      <div>Current Location: {currentLocation}</div>
      <div>Current Quantity: {currentQuantity}</div>
      <div>Current TimeStart: {currentTimeStart}</div>
      <div>Current TimeEnd: {currentTimeEnd}</div> */}

      <div>
        {requests && requests.length > 0 ? (
          requests.map((item, index) => (
            <ShopperCard
              key={index}
              userID={item.userID}
              category={item.category}
              quantity={item.quantity}
              location={item.location}
              timeStart={item.timeStart}
              timeEnd={item.timeEnd}
              matchScore={calculateMatchScore(
                currentCategory,
                parseLocation,
                currentTimeStart,
                currentTimeEnd,
                item
              )}
              reqID={item.reqID}
              currentReqID={currentReqID}
            />
          ))
        ) : (
          <p>No requests found.</p>
        )}
      </div>
    </>
  );
}

export default ShopperMatch;

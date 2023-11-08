/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import "./ShopperCard.css";
import { useRouter } from "next/navigation";

interface ShopperCardProps {
  //   reqID: string;
  userID: string;
  category: string | undefined;
  quantity: number | undefined;
  location: string | undefined;
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
  const handleLearnMore = () => {
    router.push("../ProductRec");
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
        <button className="button" onClick={handleLearnMore}>
          Select Buddy
        </button>
        <button className="button">Learn More</button>
      </div>
    </div>
  );
}

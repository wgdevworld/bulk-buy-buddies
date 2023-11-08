import React from "react";
import "./ShopperCard.css";

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
        <button className="button">Select Buddy</button>
        <button className="button">Learn More</button>
      </div>
    </div>
  );
}

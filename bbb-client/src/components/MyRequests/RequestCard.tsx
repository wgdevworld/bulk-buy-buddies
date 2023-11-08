import React from "react";
import "./RequestCard.css";

interface RequestCardProps {
  //   reqID: string;
  //   userID: string;
  category: string | undefined;
  quantity: number | undefined;
  location: string | undefined;
  timeStart: Date;
  timeEnd: Date;
  //   status: boolean;
}

export default function RequestCard({
  category,
  quantity,
  location,
  timeStart,
  timeEnd,
}: RequestCardProps) {
  return (
    <div className="card">
      {/* userD corresponds to username */}
      <p>
        Shopping for {category} at {location}
      </p>
      {/* <p>Category: {category}</p> */}
      <p>Quantity: {quantity}</p>
      {/* <p>Location: {location}</p> */}
      <p>
        Shopping start time:{" "}
        {timeStart.toISOString().slice(0, 19).replace("T", " ")}
      </p>
      <p>
        Shopping end time:{" "}
        {timeEnd.toISOString().slice(0, 19).replace("T", " ")}
      </p>
      <div className="button-container">
        <button className="button">Select Buddy</button>
        <button className="button">Learn More</button>
      </div>
    </div>
  );
}

import React from "react";
import "./ShopperCard.css";

interface ShopperCardProps {
  //   reqID: string;
  userID: string;
  category: string | undefined;
  quantity: number | undefined;
  location: string | undefined;
  //   timeStart: Date | null;
  //   timeEnd: Date | null;
  //   status: boolean;
}

export default function ShopperCard({
  userID,
  category,
  quantity,
  location,
}: ShopperCardProps) {
  return (
    <div className="card">
      {/* userD corresponds to username */}
      <h2>UserID: {userID}</h2>
      <p>Category: {category}</p>
      <p>Quantity: {quantity}</p>
      <p>Location: {location}</p>
    </div>
  );
}

import React from "react";
import { Transaction } from "./account";

function RequestCard({ request }: { request: Transaction }) {
  return (
    <li key={request._id}>
      <h4>{request.category}</h4>
      <p>status: {request.status}</p>    
      <p>quantity: {request.quantity}</p>
      <p>location: {request.location}</p>
      <p>time: {request.timeStart} to {request.timeEnd} </p>
    </li>
  );
}

export default RequestCard;
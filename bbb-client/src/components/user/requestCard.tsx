import React from "react";
import { Transaction } from "./requestDisplay";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const warehouses_temp : any = {
  "645": "RALEIGH",
  "1206": "APEX",
  "249": "DURHAM",
  "361": "WINSTON_SALEM",
  "1333": "MOORSEVILLE",
  "1587": "GARNER",
  "367": "MATTHEWS",
  "359": "CHARLOTTE",
  "339": "GREENSBORO"
}

function RequestCard({ request }: { request: Transaction }) {
  return (
    <li key={request._id}>
      <h4>{request.category}</h4>
      <p>status: {request.status}</p>    
      <p>quantity: {request.quantity}</p>
      <p>location: {request.location ? warehouses_temp[request.location] : "?"}, NC</p>
      <p>time range: {request.timeStart} to {request.timeEnd} </p>
    </li>
  );
}

export default RequestCard;
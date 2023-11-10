"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { matches } from "./SampleShoppers";
import ShopperCard from "./ShopperCard";
import { useRouter, useSearchParams } from "next/navigation";

interface ShoppingForm {
  reqID: string;
  userID: string;
  category: string;
  quantity: number;
  location: string;
  timeStart: Date;
  timeEnd: Date;
  status: string;
}

function ShopperMatch() {
  const router = useRouter();
  const [user, setUser] = useState<string>();
  const [requests, setRequests] = useState<ShoppingForm[]>([]);

  const searchParams = useSearchParams();
  const currentUserID = searchParams.get("userID");

  useEffect(() => {
    fetchMyRequests();
    // getUserAcctInfo();
  }, []);

  const fetchMyRequests = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/get-requests");
      const data = await response.json();
      console.log(data);
      setRequests(data);
    } catch (error) {
      console.error(error);
    }
  };

  // change code to extract only the id
  const getUserAcctInfo = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/get_acct_info", {
        credentials: "include",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const user_acct = await response.json();
      console.log(user_acct);
      setUser(user_acct);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1>Recommended Bulk Buy Buddies</h1>
      <div>Shoppers we recommend you match with based on your preference.</div>
      <h1>Current UserID: {currentUserID}</h1>
      <div>
        {requests.map((item, index) => (
          <ShopperCard
            key={index}
            userID={item.userID}
            category={item.category}
            quantity={item.quantity}
            location={item.location}
            timeStart={item.timeStart}
            timeEnd={item.timeEnd}
          />
        ))}
      </div>
    </>
  );
}

export default ShopperMatch;

/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { matches } from "./SampleShoppers";
import ShopperCard from "./ShopperCard";
import { useRouter } from "next/navigation";

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
  const [requests, setRequests] = useState<ShoppingForm[]>([]);
  useEffect(() => {
    fetchMyRequests();
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
  return (
    <>
      <div>Recommended Bulk Buy Buddies</div>
      <div>Shoppers we recommend you match with based on your preference.</div>
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

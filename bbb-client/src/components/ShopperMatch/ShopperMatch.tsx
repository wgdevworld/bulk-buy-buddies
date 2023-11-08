/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { matches } from "./SampleShoppers";
import ShopperCard from "./ShopperCard";
import { useRouter } from "next/navigation";

interface ShoppingForm {
  reqID: string;
  userID: string;
  category: string | undefined;
  quantity: number | undefined;
  location: string | undefined;
  timeStart: Date;
  timeEnd: Date;
  status: boolean;
}

const categories = ["beef", "pork", "chicken"];
const locations = ["Durham", "Charlotte", "Raleigh"];

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
      {/* <form onSubmit={handleSubmit}>
        <div className="vertical-container">
          <input
            type="number"
            placeholder="Enter quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />

          <button type="submit">Submit</button>
        </div>
      </form>
      {responseContent !== null && (
        <pre>{JSON.stringify(responseContent, null, 2)}</pre>
      )} */}
    </>
  );
}

export default ShopperMatch;

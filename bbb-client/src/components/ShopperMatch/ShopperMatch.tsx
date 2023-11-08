import React, { useState } from "react";
import { matches } from "./SampleShoppers";
import ShopperCard from "./ShopperCard";
// import "./ShopperForm.css";

interface ShoppingForm {
  //   reqID: string;
  //   userID: string;
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
  // const shopperList = matches.map((request) => (
  //   <li key={request.reqId}>
  //     <div>UserID: {request.userId}</div>
  //     <div>Category: {request.category}</div>
  //     <div>ProductID: {request.prodId}</div>
  //     <div>Quantity: {request.quantity}</div>
  //     <div>Location: {request.location}</div>
  //   </li>
  // ));
  //   const [category, setCategory] = useState<string | undefined>("");
  //   const [quantity, setQuantity] = useState<number | undefined>(0);
  //   const [location, setLocation] = useState<string | undefined>("");
  //   const [startDate, setStartDate] = useState<Date | null>(new Date());
  //   const [endDate, setEndDate] = useState<Date | null>(new Date());
  //   const [responseContent, setResponseContent] = useState<any | null>(null);

  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();

  //     const requestData: ShoppingForm = {
  //       category,
  //       quantity,
  //       location,
  //       timeStart: startDate,
  //       timeEnd: endDate,
  //       status: true,
  //     };

  //     try {
  //       const response = await fetch("http://127.0.0.1:5000/shopping-request", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(requestData),
  //       });

  //       if (response.ok) {
  //         const responseData = await response.text(); // Parse the response as text
  //         const parsedResponse = JSON.parse(responseData);
  //         setResponseContent(parsedResponse);
  //       } else {
  //         setResponseContent(null);
  //       }
  //     } catch (error) {
  //       console.error("An error occurred:", error);
  //       setResponseContent(null);
  //     }
  //   };
  return (
    <>
      <div>Recommended Bulk Buy Buddies</div>
      <div>Shoppers we recommend you match with based on your preference.</div>
      <div>
        {matches.map((item, index) => (
          <ShopperCard
            key={index}
            userID={item.userId}
            category={item.category}
            prodID={item.prodId}
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

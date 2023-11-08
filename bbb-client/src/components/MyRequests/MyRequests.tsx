import React, { useEffect, useState } from "react";
import RequestCard from "./RequestCard";
// import "./ShopperForm.css";

interface RequestForm {
  //   reqID: string;
  //   userID: string;
  category: string | undefined;
  quantity: number | undefined;
  location: string | undefined;
  timeStart: Date;
  timeEnd: Date;
  status: boolean;
}

function MyRequests() {
  const [requests, setRequests] = useState<RequestForm[]>([]);
  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/get_my_requests");
      const data = await response.json();
      console.log(data);
      setRequests(data);
    } catch (error) {
      console.error(error);
    }
  };
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
        {requests.map((item, index) => (
          <RequestCard
            key={index}
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

export default MyRequests;

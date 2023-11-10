"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import ShopperDropdown from "./ShopperDropdown";
import DatePicker from "react-datepicker";
import "./ShopperForm.css";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";
import "../locations/locations.css";
import Locations from "../locations/locations";

// TODO: FIX data type for location once we implement selection from google maps

interface ShoppingForm {
  //   reqID: string;
  userID: string;
  category: string;
  quantity: number | undefined;
  location: string | number | undefined;
  timeStart: Date | null;
  timeEnd: Date | null;
  status: string | undefined;
}

const categories = ["beef", "pork", "chicken"];
const locations = [249, 645, 359];

function ShopperForm() {
  const [userID, setUserID] = useState<string>("abcd");
  const [category, setCategory] = useState<string>("");
  const [quantity, setQuantity] = useState<number | undefined>(0);
  const [location, setLocation] = useState<string | number | undefined>(0);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [responseContent, setResponseContent] = useState<ShoppingForm | null>(
    null
  );

  const router = useRouter();

  const navigateShopperMatch = async () => {
    try {
      const query = {
        userID: userID,
        category: category,
        location: location,
        timeStart: startDate,
        timeEnd: endDate,
        status: "Active",
      };
      console.log("To Shopper Match page");
      router.push("/shopper/shopperMatch" + "?" + createQueryString(query));
    } catch (error) {
      console.error("Error going to ShopperMatch page", error);
    }
  };

  const createQueryString = (query: object) => {
    const params = new URLSearchParams();
    for (const [name, value] of Object.entries(query)) {
      params.set(name, value);
    }
    return params.toString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requestData: ShoppingForm = {
      userID,
      category,
      quantity,
      location,
      timeStart: startDate,
      timeEnd: endDate,
      status: "Active",
    };
    setUserID("aaaa");
    // UNCOMMENT WHEN LOGIN IMPLEMENTED CORRECTLY
    // try {
    //   const responseUserID = await fetch(
    //     "http://127.0.0.1:5000//get_acc_info"
    //     // {
    //     //   method: "GET",
    //     //   headers: {
    //     //     "Content-Type": "application/json",
    //     //   },
    //     // }
    //   );
    //   const userData = await responseUserID.json();
    //   // setUserID(userData);
    // } catch (e) {
    //   console.error(e);
    // }
    try {
      const response = await fetch("http://127.0.0.1:5000/shopping-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const responseData = await response.text();
        const parsedResponse = JSON.parse(responseData);
        setResponseContent(parsedResponse);
      } else {
        setResponseContent(null);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setResponseContent(null);
    }
  };
  return (
    <>
      <div>Form Submission</div>
      <div>
        Let us know your preferences for grocery items you want to split.
      </div>
      <form onSubmit={handleSubmit}>
        <div className="vertical-container">
          {/* SET LOCATION FROM GOOGLE MAP API */}
          {/* <ShopperDropdown
            name="Location"
            options={locations}
            value={location}
            onSelect={(selectedLocation) => setLocation(selectedLocation)}
          /> */}
          <Locations />
          <ShopperDropdown
            name="Category"
            options={categories}
            value={category}
            onSelect={(selectedCategory) => setCategory(selectedCategory)}
          />
          <input
            type="number"
            placeholder="Enter quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
          <div>
            <DatePicker
              showTimeSelect
              dateFormat="MM/dd/yyyy h:mm aa"
              selected={startDate}
              minDate={new Date()}
              onChange={(date) => setStartDate(date)}
            />
            <DatePicker
              showTimeSelect
              dateFormat="MM/dd/yyyy h:mm aa"
              selected={endDate}
              minDate={startDate}
              onChange={(date) => setEndDate(date)}
            />
          </div>
          <button type="submit" onClick={navigateShopperMatch}>
            Submit
          </button>
        </div>
      </form>
      {/* {responseContent !== null && (
        <pre>{JSON.stringify(responseContent, null, 2)}</pre>
      )} */}
    </>
  );
}

export default ShopperForm;

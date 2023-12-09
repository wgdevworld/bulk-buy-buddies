"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import ShopperDropdown from "./ShopperDropdown";
import DatePicker from "react-datepicker";
import "./ShopperForm.css";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter, useSearchParams } from "next/navigation";
import "../locations/locations.css";
import Locations from "../locations/locations";
import constants from "../../../../bbb-shared/constants.json";

// TODO: FIX data type for location once we implement selection from google maps

interface ShoppingForm {
  // reqID: string;
  userID: string;
  category: string;
  quantity: number | undefined;
  location: string | number | undefined;
  timeStart: Date | null;
  timeEnd: Date | null;
  status: string | undefined;
}

const categories = Object.keys(constants.categories);

function ShopperForm() {
  const [userID, setUserID] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [quantity, setQuantity] = useState<number | undefined>(0);
  const [location, setLocation] = useState<string | number | undefined>(0);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [responseContent, setResponseContent] = useState<ShoppingForm | null>(
    null
  );
  const [generatedID, setGeneratedID] = useState<string>("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentUserID = searchParams.get("uid");

  useEffect(() => {
    if (currentUserID !== null) {
      setUserID(currentUserID);
    }
  }, [currentUserID]);

  const navigateShopperMatch = async () => {
    try {
      const query = {
        reqID: generatedID,
        userID: userID,
        category: category,
        location: location,
        quantity: quantity,
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

    try {
      const response = await fetch("http://127.0.0.1:5000/shopping-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        // const responseData = await response.text();
        // const parsedResponse = JSON.parse(responseData);
        // const generatedID = parsedResponse._id;
        const responseData = await response.json();
        const generatedID = responseData._id;
        setGeneratedID(generatedID);
        // setResponseContent(parsedResponse);
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
      <div>Form Submission for {currentUserID}</div>
      <div>
        Let us know your preferences for grocery items you want to split.
      </div>
      <form onSubmit={handleSubmit}>
        <div className="vertical-container">
          {/* I need a way to get location from Locations below */}
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
      {/* {
        <>
          <div>{generatedID}</div>
        </>
      } */}
    </>
  );
}

export default ShopperForm;

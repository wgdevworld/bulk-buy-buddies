"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import ShopperDropdown from "./ShopperDropdown";
import DatePicker from "react-datepicker";
import "./ShopperForm.css";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter, useSearchParams } from "next/navigation";
import "../locations/locations.css";
import Locations, { Location } from "../locations/locations";
import constants from "../../../../bbb-shared/constants.json";

// TODO: FIX data type for location once we implement selection from google maps

interface ShoppingForm {
  // reqID: string;
  userID: string;
  category: string;
  quantity: number | undefined;
  location: number | undefined;
  timeStart: Date | null;
  timeEnd: Date | null;
  status: string | undefined;
}

const categories = Object.keys(constants.categories);

function ShopperForm() {
  const [userID, setUserID] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [quantity, setQuantity] = useState<number | undefined>(0);
  const [location, setLocation] = useState<number | undefined>(0);

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [responseContent, setResponseContent] = useState<ShoppingForm | null>(
    null
  );
  const [generatedID, setGeneratedID] = useState<string>("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentUserID = searchParams.get("uid");

  useEffect(() => {
    if (currentUserID !== null) {
      setUserID(currentUserID);
    }
  }, [currentUserID]);

  useEffect(() => {
    if (selectedLocation !== null) {
      setLocation(selectedLocation.lid);
    }
  }, [selectedLocation]);

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
      location: selectedLocation?.lid || 0,
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
        const responseData = await response.json();
        const generatedID = responseData._id;
        setGeneratedID(generatedID);
        setFormSubmitted(true);
      } else {
        setResponseContent(null);
        setFormSubmitted(false);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setResponseContent(null);
      setFormSubmitted(false);
    }
  };
  return (
    <>
      <div className="text-xl font-bold">
        Form Submission for {currentUserID}
      </div>
      <div className="mt-4">
        Let us know your preferences for grocery items you want to split.
      </div>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mt-4 flex flex-col items-center">
          <Locations onSelectLocation={setSelectedLocation} />
          <ShopperDropdown
            name="Category"
            options={categories}
            value={category}
            onSelect={(selectedCategory) => setCategory(selectedCategory)}
          />
          <label>How many do you want?</label>
          <input
            type="number"
            placeholder="Enter quantity"
            value={quantity}
            min={1}
            className="px-4 py-2 border rounded-lg mt-2"
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
          <label className="mt-4">When will you be shopping?</label>
          <div className="mt-4">
            <DatePicker
              showIcon
              showTimeSelect
              dateFormat="MM/dd/yyyy h:mm aa"
              selected={startDate}
              minDate={new Date()}
              onChange={(date) => setStartDate(date)}
            />
            <DatePicker
              showIcon
              showTimeSelect
              dateFormat="MM/dd/yyyy h:mm aa"
              selected={endDate}
              minDate={startDate}
              onChange={(date) => setEndDate(date)}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
          >
            Submit
          </button>
        </div>
      </form>

      <div className="flex flex-col items-center mt-8">
        {formSubmitted && (
          <div className="p-4 border rounded-md shadow-md text-center max-w-md">
            <h2 className="text-xl font-bold mb-4">Form Values:</h2>
            <p>
              <span className="font-bold">User ID:</span> {userID}
            </p>
            <p>
              <span className="font-bold">Category:</span> {category}
            </p>
            <p>
              <span className="font-bold">Quantity:</span> {quantity}
            </p>
            <p>
              <span className="font-bold">Location:</span> {location}
            </p>
            <p>
              <span className="font-bold">Start Date:</span>{" "}
              {startDate?.toLocaleString()}
            </p>
            <p>
              <span className="font-bold">End Date:</span>{" "}
              {endDate?.toLocaleString()}
            </p>
            <p>
              <span className="font-bold">Request ID:</span> {generatedID}
            </p>
          </div>
        )}

        {generatedID && (
          <button
            onClick={navigateShopperMatch}
            className="bg-green-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-green-600 focus:outline-none focus:ring focus:border-blue-300"
          >
            Match Shoppers
          </button>
        )}
      </div>

      {/* {
        <>
          <div>{generatedID}</div>
        </>
      } */}
    </>
  );
}

export default ShopperForm;
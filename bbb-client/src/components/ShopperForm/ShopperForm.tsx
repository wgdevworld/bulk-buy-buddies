"use client";

import React, { useEffect, useState } from "react";
import ShopperDropdown from "./ShopperDropdown";
import DatePicker from "react-datepicker";
import "./ShopperForm.css";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter, useSearchParams } from "next/navigation";
import "../locations/locations.css";
import Locations, { Location } from "../locations/locations";
import constants from "../../../../bbb-shared/constants.json";

// Basic interface of information we will need from users
interface ShoppingForm {
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
  const [locationName, setLocationName] = useState<string | undefined>("");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [generatedID, setGeneratedID] = useState<string>("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentUserID = searchParams.get("uid");

  const scheduleNotification = (
    targetTime: Date | null,
    userID: string,
    shopDate: Date | null,
    requestId: string,
    category: string,
    quantity: number | undefined
  ) => {
    const now = new Date();
    if (targetTime === null) {
      return;
    }

    const delay = targetTime.getTime() - now.getTime();

    if (delay < 0) {
      console.log("The scheduled time is in the past.");
      return;
    }

    if (delay !== undefined) {
      setTimeout(() => {
        if (Notification.permission === "granted" && shopDate) {
          const year = shopDate.getFullYear();
          const month = shopDate.getMonth() + 1;
          const day = shopDate.getDate();
          const formattedDate = `${year}-${month
            .toString()
            .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
          const notification = new Notification(
            "Did you request get fulfilled?",
            {
              body: `Click to confirm you shopped on ${formattedDate}`,
              data: {
                requestId: requestId,
                userId: userID,
                category: category,
                quantity: quantity,
              },
            }
          );

          notification.onclick = async (event) => {
            event.preventDefault();
            const data = notification.data;
            if (data) {
              await postToTransactionHistory({
                requestId: data.requestId,
                userId: data.userId,
                category: data.category,
                quantity: data.quantity,
              });
            }
          };
        }
      }, delay);
    }
  };

  const postToTransactionHistory = async (requestData: {
    requestId: string;
    userId: string;
    category: string;
    quantity: number;
  }) => {
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/log-transaction-history",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Transaction logged:", responseData);
    } catch (error) {
      console.error("Error logging transaction:", error);
    }
  };

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

  useEffect(() => {
    const fetchData = async () => {
      await fetchLocationName(location);
    };
    fetchData();
  }, []);

  // Navigation function to recommended shopping buddies
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

  // Creates a query string to specify navigation link
  const createQueryString = (query: object) => {
    const params = new URLSearchParams();
    for (const [name, value] of Object.entries(query)) {
      params.set(name, value);
    }
    return params.toString();
  };

  // Fetches name of a Costco warehouse using location id (lid)
  const fetchLocationName = async (location: number | undefined) => {
    console.log("fetchLocations is being called");
    try {
      const response = await fetch(
        `http://127.0.0.1:5000//get_location_name/${location}`
      );
      const locationsData = await response.json();

      if (locationsData.error) {
        console.error("Error fetching location name:", locationsData.error);
        setLocationName("Error fetching location");
      } else {
        setLocationName(locationsData);
        console.log("Locations fetched:", locationsData);
      }
    } catch (error) {
      console.error("An error occurred while fetching locations:", error);
      setLocationName("Error fetching location");
    }
  };

  // Function to submit user-input data to DB
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (startDate && endDate && startDate >= endDate) {
      alert("End date must be after start date");
      return;
    }

    const requestData: ShoppingForm = {
      userID,
      category,
      quantity,
      location: selectedLocation?.lid || 0,
      timeStart: startDate,
      timeEnd: endDate,
      status: "Active",
    };

    // POST request to DB
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
        scheduleNotification(
          endDate,
          userID,
          startDate,
          generatedID,
          category,
          quantity
        );
      } else {
        setFormSubmitted(false);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setFormSubmitted(false);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mt-4 flex flex-col items-center">
          {/* User selects location here */}
          <Locations onSelectLocation={setSelectedLocation} />
          {/* User selects product category here */}
          <ShopperDropdown
            name="Category"
            options={categories}
            value={category}
            onSelect={(selectedCategory) => setCategory(selectedCategory)}
          />
          <label>How many do you want?</label>
          {/* User selects product quantity here */}
          <input
            type="number"
            placeholder="Enter quantity"
            value={quantity}
            min={1}
            className="px-4 py-2 border rounded-lg mt-2"
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
          <label className="mt-4">When will you be shopping?</label>
          {/* User selects shopping time range */}
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
          {/* Button to submit request */}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
          >
            Submit
          </button>
        </div>
      </form>

      {/* Displays user-input data again to confirm posted data*/}
      <div className="flex flex-col items-center mt-8">
        {formSubmitted && (
          <div className="p-4 border rounded-md shadow-md text-center max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Your Request!</h2>
            <p>
              <span className="font-bold">Category:</span> {category}
            </p>
            <p>
              <span className="font-bold">Quantity:</span> {quantity}
            </p>
            <p>
              <span className="font-bold">Location:</span> {locationName}
            </p>
            <p>
              <span className="font-bold">Start Date:</span>{" "}
              {startDate?.toLocaleString()}
            </p>
            <p>
              <span className="font-bold">End Date:</span>{" "}
              {endDate?.toLocaleString()}
            </p>
          </div>
        )}

        {/* Button to start matching bulk buy buddy */}
        {generatedID && (
          <button
            onClick={navigateShopperMatch}
            className="bg-green-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-green-600 focus:outline-none focus:ring focus:border-blue-300"
          >
            Match Shoppers
          </button>
        )}
      </div>
    </>
  );
}

export default ShopperForm;

import React, { useState } from "react";
import ShopperDropdown from "./ShopperDropdown";
import DatePicker from "react-datepicker";
import "./ShopperForm.css";
import "react-datepicker/dist/react-datepicker.css";

interface ShoppingForm {
  //   reqID: string;
  //   userID: string;
  category: string | undefined;
  quantity: number | undefined;
  location: string | undefined;
  timeStart: Date | null;
  timeEnd: Date | null;
  status: boolean;
}

const categories = ["beef", "pork", "chicken"];
const locations = ["Durham", "Charlotte", "Raleigh"];

function ShopperForm() {
  const [category, setCategory] = useState<string | undefined>("");
  const [quantity, setQuantity] = useState<number | undefined>(0);
  const [location, setLocation] = useState<string | undefined>("");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [responseContent, setResponseContent] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requestData: ShoppingForm = {
      category,
      quantity,
      location,
      timeStart: startDate,
      timeEnd: endDate,
      status: true,
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
        const responseData = await response.text(); // Parse the response as text
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
          <ShopperDropdown
            name="Location"
            options={locations}
            value={location}
            onSelect={(selectedLocation) => setLocation(selectedLocation)}
          />
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
              minDate={new Date()}
              onChange={(date) => setEndDate(date)}
            />
          </div>
          <button type="submit">Submit</button>
        </div>
      </form>
      {responseContent !== null && (
        <pre>{JSON.stringify(responseContent, null, 2)}</pre>
      )}
    </>
  );
}

export default ShopperForm;

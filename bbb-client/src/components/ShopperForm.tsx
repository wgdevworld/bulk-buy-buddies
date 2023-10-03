import React, { useState } from "react";
import ShopperDropdown from "./ShopperDropdown";
import DatePicker from "react-datepicker";
import "../components/ShopperForm.css";
import "react-datepicker/dist/react-datepicker.css";

interface ShoppingForm {
  //   reqID: string;
  //   userID: string;
  category: string;
  quantity: number;
  location: string;
  timeStart: Date;
  timeEnd: Date;
  status: boolean;
}

const options = ["beef", "pork", "chicken"];

function ShopperForm() {
  const [category, setCategory] = useState<string>();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [quantity, setQuantity] = useState<number>();
  const [date1, setDate1] = useState(new Date());
  const [formData, setFormData] = useState<ShoppingForm>({
    // reqID: "",
    // userID: "",
    category: "",
    quantity: 0,
    location: "",
    timeStart: new Date(),
    timeEnd: new Date(),
    status: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Make an HTTP POST request to your Flask backend
      const response = await fetch("/api/submit-shopping-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Handle successful submission
        console.log("Shopping request submitted successfully");
      } else {
        // Handle errors
        console.error("Failed to submit shopping request");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleCategorySelect = (selectedOption: string) => {
    console.log(`Selected option: ${selectedOption}`);
    // update useState
  };

  const handleStartTimeSelect = (selectedOption: void) => {
    console.log(`Selected option: ${selectedOption}`);
    // update useState
  };

  return (
    <>
      <div>Form Submission</div>
      <div>
        Let us know your preferences for grocery items you want to split.
      </div>
      <form onSubmit={handleSubmit}>
        {/* Render form fields based on the ShoppingForm interface */}
        <div className="vertical-container">
          <ShopperDropdown options={options} onSelect={handleCategorySelect} />
          <input type="number" placeholder="Enter quantity" />
          <div>
            <DatePicker selected={date1} onChange={(date) => setDate1(date1)} />
            <DatePicker
              showTimeSelect
              dateFormat="MM/dd/yyyy h:mm aa"
              selected={startDate}
              minDate={new Date()}
              onChange={(date) => setStartDate(startDate)}
            />
            <DatePicker
              showTimeSelect
              dateFormat="MM/dd/yyyy h:mm aa"
              selected={endDate}
              minDate={new Date()}
              onChange={(date) => setEndDate(endDate)}
            />
          </div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </>
  );
}

export default ShopperForm;

import React, { useState } from "react";
import ShopperDropdown from "./ShopperDropdown";
import DateTimePicker from "react-datetime-picker";

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

  const handleStartTimeSelect = (selectedOption: Date) => {
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
        <ShopperDropdown options={options} onSelect={handleCategorySelect} />
        <DateTimePicker onChange={handleStartTimeSelect} />
        <input type="number" placeholder="Enter quantity" />
        {/* <input
          type="text"
          placeholder="Request ID"
          value={formData.reqID}
          onChange={(e) => setFormData({ ...formData, reqID: e.target.value })}
        />
        <input type="text" /> */}
        {/* Other form fields go here */}
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default ShopperForm;

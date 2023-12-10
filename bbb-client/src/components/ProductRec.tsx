"use client";

import { list } from "postcss";
import React, { useState, useEffect, Fragment } from "react";
import ProductCard from "./ProductList/ProductCard";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export interface Product {
  _id: string;
  name: string;
  price: number;
  src: string;
}

const ProductRec = () => {
  // const [userCategory, setUserCategory] = useState<String>('');
  // const [userQuantity, setUserQuantity] = useState<String>('');
  // const [buddyQuantity, setBuddyQuantity] = useState<String>('');
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [dateJoined, setJoined] = useState();
  const router = useRouter();
  const searchParams = useSearchParams();
  const buddyID = searchParams.get("userID");
  const userCategory = searchParams.get("userCategory");
  const userQuantity = searchParams.get("userQuantity");
  const buddyQuantity = searchParams.get("buddyQuantity")!;
  const location = searchParams.get("location")!;

  useEffect(() => {
    console.log(products);
  }, [products]);

  useEffect(() => {
    console.log("buddyid ", buddyID);
    // retrieve information about the buddy that was clicked
    // INCLUDES: uid of buddy, preferably also information about the active request clicked
    // via session storage? or whatever mechanism we find
    // get user information about buddy
    // run request information through backend function to fetch product recommenations
    fetchBuddy(buddyID);
    fetchProducts(userCategory, userQuantity, buddyQuantity, location);
  }, []);

  const fetchProducts = async (
    userCategory: any,
    userQuantity: any,
    buddyQuantity: any,
    location: any
  ) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/fetchSimilarProducts?userCategory=${userCategory}&userQuantity=${userQuantity}&buddyQuantity=${buddyQuantity}&location=${location}`
      );
      if (!response.ok) {
        // Handle success, e.g., show a success message
        console.error("Failed to submit form data");
      }
      const data = await response.json();
      setProducts(data.results);
    } catch (error) {
      console.error("An error occurred while submitting the form:", error);
    }
  };
  const fetchBuddy = async (buddyID: any) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/fetchBuddyInfo?buddyID=${buddyID}`
      );
      if (!response.ok) {
        // Handle success, e.g., show a success message
        console.error("Failed to submit form data");
      }
      const data = await response.json();
      const name = data.results.firstname + " " + data.results.lastname;

      console.log("data: ", data);
      setName(name);
      const location = data.dateJoined;
      setJoined(location);
    } catch (error) {
      console.error("An error occurred while submitting the form:", error);
    }
  };

  const sendBuddyRequest = async () => {
    try {
      const query = {
        currentUserID: "abcd",
        buddyUserID: buddyID,
      };
      console.log("To Messenger");
      router.push("/messenger" + "?" + createQueryString(query));
    } catch (error) {
      console.error("Error going to Messenger page", error);
    }
  };

  const createQueryString = (query: object) => {
    const params = new URLSearchParams();
    for (const [name, value] of Object.entries(query)) {
      params.set(name, value);
    }
    return params.toString();
  };

  // const onRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     setUserCategory(e.currentTarget.value);
  // };
  // const onUserqChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     setUserQuantity(e.currentTarget.value);
  // };
  // const onBuddyqChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     setBuddyQuantity(e.currentTarget.value);
  // };
  // const radioOptions = [
  //     { view: "Chicken", value: "chicken" },
  //     { view: "Pork", value: "pork" },
  //     { view: "Turkey", value: "turkey" },
  //     { view: "Beef", value: "beef" },
  //     { view: "Coffee", value: "coffee-sweeteners" },
  // ];
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* <div>
                <p>Choose users' product category</p>
                {radioOptions.map(({view: title, value: option}: any) => {
                    return (
                        <>
                            <input
                                type="radio"
                                value={option}
                                name={option}
                                checked = {option === userCategory}
                                onChange={(e) => onRadioChange(e)}
                            />
                            {title}<br/>
                        </>
                    );
                })}
            </div><br/> */}
      {/* <div>
                <label>
                User Quantity:
                <input
                    type="text"
                    name="quantity"
                    onChange={(e) => onUserqChange(e)}
                />
                </label>
            </div>
            <div>
                <label>
                Buddy Quantity:
                <input
                    type="text"
                    name="quantity"
                    onChange={(e) => onBuddyqChange(e)}
                />
                </label>
            </div><br/> */}
      {/* <button type="submit" onClick={handleClick}>Submit</button> */}
      {name !== "" ? (
        <>
          <h3>Buddy Name: ${name}</h3>
          <h6>Date Joined: ${dateJoined}</h6>
        </>
      ) : (
        <></>
      )}
      <button type="submit" onClick={sendBuddyRequest}>
        Send Buddy Request
      </button>
      {products && products.length !== 0 ? (
        <>
          <br />
          <p>Here are products you recommend you purchase with ${name}!</p>
          <ul className="product-list">
            {products.map((product: Product) => (
              <ProductCard product={product} key={product._id} />
            ))}
          </ul>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ProductRec;

"use client";

import { list } from "postcss";
import React, { useState, useEffect, Fragment } from "react";
import ProductCard from "./ProductList/ProductCard";
import { Product } from "./ProductList/ProductMain";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface userInteraction {
  from_requestID: string | null;
  to_requestID: string | null;
  status: string;
}


const ProductRec = () => {
  // const [userCategory, setUserCategory] = useState<String>('');
  // const [userQuantity, setUserQuantity] = useState<String>('');
  // const [buddyQuantity, setBuddyQuantity] = useState<String>('');
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [dateJoined, setJoined] = useState(null);
  const [userID, setUserID] = useState(null);
  const [buddyID, setBuddyID] = useState(null);
  const [userCategory, setUserCategory] = useState(null);
  const [userQuantity, setUserQuantity] = useState(null);
  const [buddyQuantity, setBuddyQuantity] = useState(null);
  const [location, setLocation] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const prevPage = searchParams.get("function");
  const userRequest = searchParams.get("userReqID");
  const buddyRequest = searchParams.get("buddyReqId");

  // const userCategory = searchParams.get("userCategory");
  // const userQuantity = searchParams.get("userQuantity");
  // const buddyQuantity = searchParams.get("buddyQuantity")!;
  // const location = searchParams.get("location")!;

  useEffect(() => {
    // console.log("buddyid ", buddyID);
    // TODO: create fetch that takes in requestID and returns relevant info: ID, quantity, category, location
    fetchRequestInfo(userRequest, 'user');
    fetchRequestInfo(buddyRequest, 'buddy');
  }, []);

  useEffect(() => {
    if(buddyID != null){
      // fetch the buddies' information
      fetchBuddy(buddyID);
    }    
  }, [buddyID]);

  useEffect(() => {
    console.log('endpoint is hit?')
    if(userCategory != null && userQuantity != null && buddyQuantity != null && location != null){
      console.log('endpoint is hit!')
      // fetch the buddies' information
      fetchProducts(userCategory, userQuantity, buddyQuantity, location);
    }    
  }, [userCategory, userQuantity, buddyQuantity, location]);

  const fetchProducts = async (
    userCategory: any,
    userQuantity: any,
    buddyQuantity: any,
    location: any
  ) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/fetchSimilarProducts?userCategory=${encodeURIComponent(userCategory)}&userQuantity=${encodeURIComponent(userQuantity)}&buddyQuantity=${encodeURIComponent(buddyQuantity)}&location=${encodeURIComponent(location)}`
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
      setName(name);
      const date = data.results.dateJoined;
      setJoined(date);
    } catch (error) {
      console.error("An error occurred while fetching the data:", error);
    }
  };
  const fetchRequestInfo = async (requestID: string | null, forUserType: string | null) => {
    try{
      if(requestID == null || forUserType == null) {
        return;
      }
      const response = await fetch(
        `http://127.0.0.1:5000/fetchRequestInfo?requestID=${requestID}`
      );
      if (!response.ok) {
        console.error("Failed to submit form data");
      }
      const data = await response.json();
      if(forUserType == 'user'){
        setUserID(data.results.userID);
        console.log('user category is', data.results.category)  
        setUserCategory(data.results.category);  
        console.log('user quantity is', data.results.quantity)  
        setUserQuantity(data.results.quantity); 
        console.log('user location is', data.results.location)  
        setLocation(data.results.location);  
      } 
      else if(forUserType == 'buddy'){
        console.log('buddy ID is', data.results.userID)
        setBuddyID(data.results.userID);  
        console.log('buddy quantity is', data.results.quantity)
        setBuddyQuantity(data.results.quantity);
      } 
    } catch (error) {
      console.error("An error occurred while fetching the data:", error);
    }
  }
  const sendBuddyRequest = async () => {
    try {
      const requestData: userInteraction = {
        from_requestID: userRequest,
        to_requestID: buddyRequest,
        status: "requested",
      };  
      const response = await fetch(`http://127.0.0.1:5000/buddy-request`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );
      if (!response.ok) {
        // Handle success, e.g., show a success message
        console.error("Failed to submit buddy request");
      }                                 
      const query = {
        currentUserID: userID,
        buddyUserID: buddyID,
      };
      console.log("To Messenger");
      router.push("/messenger" + "?" + createQueryString(query));
    } catch (error) {
      console.error("Error going to Messenger page", error);
    }
  };
  const acceptMatch = async () => {
    try {
      const acceptData = {
        from_requestID: userRequest,
        to_requestID: buddyRequest,
      }
      const response = await fetch(`http://127.0.0.1:5000/update-database`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(acceptData),
      }
    );
    router.push("/landingPage");
    } catch (error) {
      console.error("Error accepting match", error);
    }
  }
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
        flexDirection: "column"
      }}
    >
      {name !== "" ? (
        <>
          <h3>Buddy Name: {name}</h3>
          <h6>Date Joined: {dateJoined}</h6>
        </>
      ) : (
        <></>
      )}
      {prevPage == "requesting_match" ? (
        <button type="submit" onClick={sendBuddyRequest}>
          Request Match
        </button>
      ) : (
        <button type="submit" onClick={acceptMatch}>
          Accept Match
        </button>
      )}
      {products && products.length !== 0 ? (
        <>
          <br/>
          <p>Here are products you recommend you purchase with {name}!</p>
          <ul className="product-list">
            {products.map((product: Product) => (
              <ProductCard product={product} setModalVisible={()=> {}} setSelectedProductId={()=> {}}/>
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

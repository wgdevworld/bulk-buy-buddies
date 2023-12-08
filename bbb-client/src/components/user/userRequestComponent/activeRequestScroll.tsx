"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import ShopperCardProps from "@/components/ShopperMatch/ShopperCard"
import ActiveRequestCard, { RequestWithMatches } from "@/components/user/userRequestComponent/activeRequestCard"

function ActiveRequestScroll() {
    const [activeReqs, setActiveReqs] = useState<RequestWithMatches[]>([]);
    const router = useRouter()
    const handleScroll = (event) => {
        const container = event.target;
        const scrollAmount = event.deltaY;
        container.scrollTo({
          top: 0,
          left: container.scrollLeft + scrollAmount,
          behavior: 'smooth'
        });
      };
      

    useEffect(() => {
        getUserActiveReqs();
    }, []);

    const handleSearch = async () => {
        console.log("searching for", category);
        try {
          const url = `http://127.0.0.1:5000/search?query=${encodeURIComponent(
            searchTerm
          )}&min_price=${encodeURIComponent(
            minPrice
          )}&max_price=${encodeURIComponent(
            maxPrice
          )}&category=${encodeURIComponent(category)}`;
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setProducts(data.results);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
    };

    //status, category, date min, date max, location
    /*
            const url = `http://127.0.0.1:5000/get_active_reqs?status=${encodeURIComponent(
                searchTerm
              )}&category=${encodeURIComponent(
                minPrice
              )}&minDate=${encodeURIComponent(
                maxPrice
              )}&maxDate=${encodeURIComponent(
                category)}&location=${encodeURIComponent(category)}`
    */
    const getUserActiveReqs= async () => {
        try {
          const response = await fetch("http://127.0.0.1:5000/get_active_reqs", {
            credentials: "include",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
          })
          const requests = await response.json();
          console.log(requests)
          setActiveReqs(requests)
        } catch (error) {
          console.error(error);
        }
    }

    return (
        <div className="mt-2 p-2">
            <p>
                <span className="text-xl font-bold tracking-tight text-gray-900"> Top Active Requests </span>
                <a href="/user/account" className="ml-3 underline underline-offset-auto font-light text-xs hover:underline-offset-2">View all active requests >> </a>
            </p>
            <ul className="flex flex-row overflow-x-auto flex-nowrap" onWheel={handleScroll}>
                {activeReqs.map((item) => (
                    <ActiveRequestCard 
                        key={item._id}
                        _id={item._id}
                        userID={item.userID}
                        category={item.category}
                        quantity={item.quantity}
                        location={item.location}
                        timeStart={item.timeStart}
                        timeEnd={item.timeEnd}
                        status={item.status}
                        matches={item.matches}
                    />
                ))}
            </ul>
        </div>
    );
}

export default ActiveRequestScroll;
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import ActiveRequestCard, { RequestWithMatches } from "@/components/user/userRequestComponent/activeRequestCard"
import { Account } from "@/components/user/account";

function ActiveRequestScroll({ userID }: { userID: string | undefined }) {
    const [activeReqs, setActiveReqs] = useState<RequestWithMatches[]>([]);
    const router = useRouter()     

    useEffect(() => {
        getUserActiveReqs();
    }, []);

    const createQueryString = (name: string, value: string) => {
        const params = new URLSearchParams();
        params.set(name, value);
        return params.toString();
    };

    const navigateNewRequest = async () => {
        try {
            console.log("go to make new request page")
            if (userID) {
                router.push('/shopper/shopperForm?' + createQueryString("uid", userID) )
            }
            else {
                console.error("uid does not exist") 
            }
        } catch (error) {
            console.error("Error going to udpate page:", error);
        }
    }


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
                <a href="/user/requestsPage" className="ml-3 underline underline-offset-auto font-light text-xs hover:underline-offset-2">View all active requests >> </a>
            </p>
            
            {activeReqs.length == 0 ?
                <div className="mt-2 mb-10 p-2 sm:mt-0 sm:w-full sm:max-w-sm sm:flex-shrink-0">
                    <span className="break-normal text-base font-medium ml-1 text-gray-600"> No current active requests. </span>
                    <a onClick={navigateNewRequest} className="ml-2 underline underline-offset-auto text-base font-medium hover:underline-offset-2 text-gray-600"> Make a new request </a>
                </div>
                :
                <ul className="flex flex-row overflow-x-auto flex-nowrap w-full">
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
            }
        </div>
    );
}

export default ActiveRequestScroll;
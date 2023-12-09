"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import MatchedRequestCard, {MatchedRequest} from "./matchedRequestCard";

function MatchedRequestScroll() {
    const [matchedReqs, setMatchedReqs] = useState<MatchedRequest[]>([]);
    const router = useRouter()

    useEffect(() => {
        getUserMatchedReqs();
    }, []);

    const getUserMatchedReqs= async () => {
        try {
          const response = await fetch("http://127.0.0.1:5000/get_matched_reqs", {
            credentials: "include",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
          })
          const matches = await response.json();
          console.log(matches)
          setMatchedReqs(matches)
        } catch (error) {
          console.error(error);
        }
    }

    return (
        <div className="mt-2 p-2">
            <p>
                <span className="text-xl font-bold tracking-tight text-gray-900"> Top Matched Requests </span>
                <a href="/user/account" className="ml-3 underline underline-offset-auto font-light text-xs hover:underline-offset-2">View all matched requests >> </a>
            </p>
            
            {matchedReqs.length == 0 ?
                <div className="mt-2 mb-10 p-2 sm:mt-0 sm:w-full sm:max-w-sm sm:flex-shrink-0">
                    <p className="break-normal text-base font-medium ml-1 text-gray-600"> No current matched requests </p>
                </div>
                :
                <ul className="flex flex-row overflow-x-auto flex-nowrap">
                    {matchedReqs.map((item) => (
                        <MatchedRequestCard 
                            key={item._id}
                            _id={item._id}
                            userID={item.userID}
                            category={item.category}
                            buddy={item.buddy}
                            buddyID={item.buddyID}
                            quantity={item.quantity}
                            location={item.location}
                            timeStart={item.timeStart}
                            timeEnd={item.timeEnd}
                            status={item.status}
                        />
                    ))}
                </ul>
            }
        </div>
    );
}

export default MatchedRequestScroll;
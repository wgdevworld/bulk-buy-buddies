"use client";

import React, { useState, useEffect } from "react";
import StandardButton from './button';
import { useRouter } from 'next/navigation';
import RequestDisplay from "./requestDisplay";
import { Account } from "@/components/user/account";
import Logout from "@/components/user/logout";
import ActiveRequestScroll from "./userRequestComponent/activeRequestScroll";
import MatchedRequestScroll from "./userRequestComponent/matchedRequestScroll";


function LandingPage() {
    const [user, setUser] = useState<Account>();
    const [doneLoading, setDoneLoading] = useState(false);
    const router = useRouter()

    useEffect(() => {
        getUserAcctInfo();
    }, []);

    const getUserAcctInfo = async () => {
        try {
          const response = await fetch("http://127.0.0.1:5000/get_acct_info", {
            credentials: "include",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
          })
          const user_acct = await response.json();

          if (user_acct == null) {
            console.log("NOOO")
            router.push('/user/login')
          }
          else {
            console.log(user_acct)
            setUser(user_acct)
            setDoneLoading(true)
          }
        } catch (error) {
          console.error(error);
        }
    }

    const createQueryString = (name: string, value: string) => {
        const params = new URLSearchParams();
        params.set(name, value);
        return params.toString();
      };


    const navigateNewRequest = async () => {
        try {
            console.log("go to make new request page")
            const userID = user?.uid ? user.uid : ""
            if (userID != "") {
                router.push('/shopper/shopperForm?' + createQueryString("uid", userID) )
            }
            else {
                console.error("uid does not exist") 
            }
            
        } catch (error) {
            console.error("Error going to udpate page:", error);
        }
    }

    const navigateAccount = async () => {
        try {
            console.log("go to account page");
            router.push("/user/account");
        } catch (error) {
            console.error("Error going to account page:", error);
        }
    };

    return (
        <div>
            <h2 className="mt-10 text-left text-xl font-bold leading-9 tracking-tight text-gray-900">
                Welcome, {user?.firstname}
            </h2>
            {/* <h1> Welcome, {user?.firstname} </h1> */}
            <button onClick={navigateNewRequest} className="flex rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600" > Make a new Request </button>
            <br/>
            <button onClick={navigateAccount} className="flex rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600" > View Account Information </button>
            {/* <StandardButton onClick={navigateAccount} label="View Account Information" /> */}
            <Logout />

            {doneLoading ?
                <div>
                    <ActiveRequestScroll/>
                    <MatchedRequestScroll/>
                </div>
                // <RequestDisplay/>
                :
                <div/>
            }
        </div>
    )

}

export default LandingPage;
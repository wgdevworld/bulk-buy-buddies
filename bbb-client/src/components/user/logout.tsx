"use client";

import React, { useState, useEffect } from "react";
import StandardButton from './button';
import { useRouter } from 'next/navigation';

function Logout() {
    const [success, setSuccess] = useState(false);
    const router = useRouter()

    useEffect(() => {
        getCurrUser();
    }, []);

    const getCurrUser = async () => {
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
            router.push('/user/login')
          }
          console.log(user_acct)
          } catch (error) {
            console.error(error);
          }
    }

    const logoutUser = async () => {

        console.log('Button clicked!');
        try {
            const response = await fetch("http://127.0.0.1:5000/logout", {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            console.log(response)
            if (!response.ok) {
                throw new Error("Failed to logout");
            }
            console.log(response.json())
            setSuccess(true)
            console.log("Successfully logged out")
            router.push('/user/login')
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <div>
            {success ?
                <div> 
                    <div> Successfully logged out! </div>
                </div>
                :
                <div>
                    {/* <h1>Logout of account</h1> */}
                    <button onClick={logoutUser} className="flex rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600" > Log Out </button>
                    {/* <StandardButton onClick={logoutUser} label="Log Out" /> */}
                </div>
            }
        </div>
    );
}

export default Logout;
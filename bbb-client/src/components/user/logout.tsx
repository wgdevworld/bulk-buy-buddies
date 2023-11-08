"use client";

import React, { MouseEvent, useState, useEffect } from "react";
import StandardButton from './button';

function Logout() {
    const [success, setSuccess] = useState(false);

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
                    <h1>Logout of account</h1>
                    <StandardButton onClick={logoutUser} label="Log Out" />
                </div>
            }
        </div>
    );
}

export default Logout;
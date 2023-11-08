"use client";

import React, { useState, useEffect } from "react";
import StandardButton from './button';
import { useRouter } from 'next/navigation';
import RequestDisplay from "./requestDisplay";


export interface Account {
    _id: string;
    uid: string;
    firstname: string;
    lastname: string;
    email: string;
    address: {
        address: string;
        city: string;
        state: string;
        zipcode: string;
    }
    dateJoined: string;
}

function Account() {
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
          console.log(user_acct)
          setUser(user_acct)
          setDoneLoading(true)
        } catch (error) {
          console.error(error);
        }
    }


    const navigateUpdateUser = async () => {
        try {
            console.log("go to udpate page")
            router.push('/user/editAccount')
        } catch (error) {
            console.error("Error going to udpate page:", error);
        }
    }

    return (
        <div>
            <h1> Welcome, {user?.firstname} </h1>
            <p> Account #: {user?.uid} </p>
            <StandardButton onClick={navigateUpdateUser} label="Edit account information" />

            {doneLoading ?
                <RequestDisplay/>
                :
                <div/>
            }
        </div>
    )

}

export default Account;
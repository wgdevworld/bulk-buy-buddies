"use client";

import React, { useState, useEffect } from "react";
import StandardButton from './button';
import RequestCard from "./requestCard";
import { useRouter } from 'next/navigation';

export interface Transaction {
    _id: string;
    rid: string;
    uid: string;
    category: string;
    pid: string;
    quantity: number;
    location: number[];
    timeStart: string;
    timeEnd: string;
    status: string;
}

export interface Account {
    _id: string;
    uid: string;
    firstname: string;
    lastname: string;
    email: string;
    location: string;
    dateJoined: string;
}

function Account() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [user, setUser] = useState<Account>();
    const router = useRouter()

    useEffect(() => {
        getUserAcctInfo();
        getUserTransactions();
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
          console.log(user_acct)
          setUser(user_acct)
        } catch (error) {
          console.error(error);
        }
    }

    const getUserTransactions= async () => {
        try {
          const response = await fetch("http://127.0.0.1:5000/get_transactions", {
            credentials: "include",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
          })
          const requests = await response.json();
          console.log(requests)
          setTransactions(requests)
        } catch (error) {
          console.error(error);
        }
    }

    const navigateUpdateUser = async () => {
        try {
            console.log("go to udpate page")
            // router.push('/user/update_info')
        } catch (error) {
            console.error("Error going to udpate page:", error);
        }
    }

    return (
        <div>
            <h1> Welcome, {user?.firstname} </h1>
            <p> Account: {user?.uid} </p>
            <StandardButton onClick={navigateUpdateUser} label="Edit account information" />
            <h1> History </h1>
            <ul className="product-list">
                {transactions.map((request: Transaction) => (
                <RequestCard request={request} key={request._id} />
                ))}
            </ul>
        </div>
    )

}

export default Account;
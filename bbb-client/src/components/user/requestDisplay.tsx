import React, { useState, useEffect } from "react";
import { Transaction } from "./account";
import RequestCard from "./requestCard";


function RequestDisplay() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        getUserTransactions();
    }, []);

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

    return (
        <div>
            <h1> History </h1>
            <ul className="product-list">
                {transactions.map((request: Transaction) => (
                <RequestCard request={request} key={request._id} />
                ))}
            </ul>
        </div>
    );
  }
  
  export default RequestDisplay;
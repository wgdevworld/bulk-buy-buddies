import React, { useState, useEffect } from "react";
import RequestCard from "./requestCard";
import ShopperDropdown from "../ShopperForm/ShopperDropdown";

export interface Transaction {
    _id: string;
    userID: string;
    category: string;
    quantity: number;
    location: string;
    timeStart: string;
    timeEnd: string;
    status: string;
}

function RequestDisplay() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [fiterType, setFilterType] = useState("most recent")
    const filterOptions = ["most recent", "fulfilled", "matched", "active"]

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
            <ShopperDropdown
                            name="Filter"
                            options={filterOptions}
                            value={fiterType}
                            onSelect={(selectedFilter) => setFilterType(selectedFilter)}
                        />
            <ul className="product-list">
                {transactions.map((request: Transaction) => (
                <RequestCard request={request} key={request._id} />
                ))}
            </ul>
        </div>
    );
}
  
export default RequestDisplay;
"use client";

import React, { useState, useEffect } from "react";
import StandardButton from "./button";
import { useRouter } from "next/navigation";
import Layout from "../CommonLayout";
// import RequestDisplay from "./requestDisplay";

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
  };
  dateJoined: string;
}

function Account() {
  const [user, setUser] = useState<Account>();
  const [doneLoading, setDoneLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getUserAcctInfo();
  }, []);

  const getUserAcctInfo = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/get_acct_info", {
        credentials: "include",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const user_acct = await response.json();

      if (user_acct == null) {
        console.log("NOOO");
        router.push("/user/login");
      } else {
        console.log(user_acct);
        setUser(user_acct);
        setDoneLoading(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const navigateUpdateUser = async () => {
    try {
      console.log("go to udpate page");
      router.push("/user/editAccount");
    } catch (error) {
      console.error("Error going to udpate page:", error);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-5 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">ACCOUNT</h1>
        <p className="text-gray-700 mb-2">
          First Name: <span className="font-medium">{user?.firstname}</span>
        </p>
        <p className="text-gray-700 mb-2">
          Last Name: <span className="font-medium">{user?.lastname}</span>
        </p>
        <p className="text-gray-700 mb-2">
          Account #: <span className="font-medium">{user?.uid}</span>
        </p>
        <p className="text-gray-700 mb-2">
          Member Since: <span className="font-medium">{user?.dateJoined}</span>
        </p>
        <p className="text-gray-700 mb-2">
          Email: <span className="font-medium">{user?.email}</span>
        </p>
        <p className="text-gray-700 mb-2">
          Address: <br />
          <span className="font-medium">
            {user?.address.address} <br />
            {user?.address.city}, {user?.address.state} {user?.address.zipcode}
          </span>
        </p>
        <button
          onClick={navigateUpdateUser}
          className="px-4 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600"
        >
          Edit account information
        </button>

        {/* {doneLoading ?
        <RequestDisplay/>
        :
        <div/>
      } */}
      </div>
    </Layout>
  );
}

export default Account;

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Account } from "@/components/user/account";
import Logout from "@/components/user/logout";
import ActiveRequestScroll from "./userRequestComponent/activeRequestScroll";
import MatchedRequestScroll from "./userRequestComponent/matchedRequestScroll";
import Layout from "../CommonLayout";

function LandingPage() {
  const [user, setUser] = useState<Account>();
  const [doneLoading, setDoneLoading] = useState(false);
  const router = useRouter();

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    } else if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission;
    }
  };

  useEffect(() => {
    getUserAcctInfo();
    requestNotificationPermission();
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

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams();
    params.set(name, value);
    return params.toString();
  };

  const navigateNewRequest = async () => {
    try {
      console.log("go to make new request page");
      const userID = user?.uid ? user.uid : "";
      if (userID != "") {
        router.push("/shopper/shopperForm?" + createQueryString("uid", userID));
      } else {
        console.error("uid does not exist");
      }
    } catch (error) {
      console.error("Error going to udpate page:", error);
    }
  };

  const navigateRequests = async () => {
    try {
      console.log("go to requests page");
      router.push("/user/requestsPage");
    } catch (error) {
      console.error("Error going to request page:", error);
    }
  };

  const navigateAccount = async () => {
    try {
      console.log("go to account page");
      router.push("/user/account");
    } catch (error) {
      console.error("Error going to account page:", error);
    }
  };

  return (
    <Layout>
      <div>
        <div
          className="absolute bg-cover opacity-20 z-0"
          style={{
            backgroundImage: "url('../images/costco.jpg')",
            height: "600px",
          }}
        >
          <img src="../images/costco.jpg" className="opacity-0" />
        </div>
        <div className="absolute z-40">
          <div className="ml-20 mt-60">
            <h2 className="ml-10 text-left my-2 text-4xl font-bold leading-9 tracking-tight text-gray-900">
              Welcome, {user?.firstname}
            </h2>
            <p className="ml-12 my-6">
              <p className="text-base font-semibold text-gray-900 my-1">
                It&#39;s time to embark on your bulk sharing journey!
              </p>
              <p className="text-base font-semibold text-gray-900">
                Make a request, save money, and find you bulk buy buddy today!
              </p>
            </p>
            <div className="ml-12 flex items-center justify-start gap-x-4">
              <button
                onClick={navigateNewRequest}
                className="flex mb-3 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                {" "}
                Make a Request{" "}
              </button>
              <button
                onClick={navigateRequests}
                className="flex mb-3 rounded-md bg-gray-100 outline outline-1 outline-blue-600 px-3  py-1.5 text-sm font-semibold leading-6 text-blue-900 shadow-sm hover:bg-blue-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                {" "}
                View my Requests{" "}
              </button>
            </div>
          </div>
        </div>
        <div className="absolute m-5" style={{ marginTop: "625px" }}>
          {doneLoading ? (
            <div>
              <ActiveRequestScroll userID={user?.uid} />
              <MatchedRequestScroll />
              <a
                href="/user/requestsPage"
                className="mt-2 p-2 text-xl font-bold tracking-tight underline underline-offset-auto hover:underline-offset-2 hover:decoration-2 text-gray-900"
              >
                {" "}
                View All Requests{" "}
              </a>
            </div>
          ) : (
            <div />
          )}
        </div>
      </div>
    </Layout>
  );
}

export default LandingPage;

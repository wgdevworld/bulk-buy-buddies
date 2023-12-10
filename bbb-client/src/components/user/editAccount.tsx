"use client";

import React, { FormEvent, useState, useEffect } from "react";
import ShopperDropdown from "../ShopperForm/ShopperDropdown";
import StandardButton from "./button";
import { Account } from "@/components/user/account";
import { useRouter } from "next/navigation";
import { states } from "@/components/user/register";
import Layout from "../CommonLayout";

function EditAccount() {
  const [user, setUser] = useState<Account>();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [editSuccess, setEditSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const router = useRouter();

  useEffect(() => {
    getCurrUser();
  }, []);

  const getCurrUser = async () => {
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
        router.push("/user/login");
      }
      console.log(user_acct);
      setUser(user_acct);
      return user_acct;
    } catch (error) {
      console.error(error);
    }
  };

  const resetPassword = async () => {
    try {
      console.log("account reset password");
      const user_info = {
        email: user?.email,
      };
      console.log(user_info);

      const response = await fetch("http://127.0.0.1:5000/reset_password", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user_info),
      });
      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to reset password");
      }
      console.log(response.json());
      setPasswordSuccess(true);
      console.log(
        "Reset password instructions sent to email associated with this account!"
      );
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  const updateInfo = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const user_info = {
        firstname: firstname == "" ? user?.firstname : firstname,
        lastname: lastname == "" ? user?.lastname : lastname,
        address: {
          address: address == "" ? user?.address["address"] : address,
          city: city == "" ? user?.address["city"] : city,
          state: state == "" ? user?.address["state"] : state,
          zipcode: zipcode == "" ? user?.address["zipcode"] : zipcode,
        },
      };
      console.log(user_info);
      const response = await fetch("http://127.0.0.1:5000/updateAccount", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user_info),
      });
      console.log(response);
      console.log(response.json());

      if (!response.ok) {
        throw new Error("Failed to edit user info");
      }
      console.log("edit user info");
      setEditSuccess(true);
    } catch (error) {
      console.error("Error editing user info:", error);
    }
  };

  const navigateAccountPage = async () => {
    try {
      console.log("go to account page");
      router.push("/user/account");
    } catch (error) {
      console.error("Error going to account page:", error);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-5 bg-white shadow-lg rounded-lg">
        {editSuccess ? (
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600 mb-4">
              Information Updated
            </div>
            <button
              onClick={navigateAccountPage}
              className="px-4 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600"
            >
              Back to Account
            </button>
          </div>
        ) : (
          <div>
            <form onSubmit={updateInfo} className="space-y-4">
              <div>
                <label className="block text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstname"
                  value={firstname || user?.firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div>
                <label className="block text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastname"
                  value={lastname || user?.lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div>
                <label className="block text-gray-700">Address</label>
                <input
                  type="text"
                  name="email"
                  value={address || user?.address["address"]}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div>
                <label className="block text-gray-700">City / Town</label>
                <input
                  type="text"
                  name="email"
                  value={city || user?.address["city"]}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              {/* ShopperDropdown component should be styled separately */}
              <div>
                <label className="block text-gray-700">Zip / Postal Code</label>
                <input
                  type="text"
                  name="email"
                  value={zipcode || user?.address["zipcode"]}
                  onChange={(e) => setZipcode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600"
              >
                Update Information
              </button>
            </form>
            <button
              onClick={resetPassword}
              className="mt-4 w-full px-4 py-2 bg-green-500 text-white font-medium rounded hover:bg-green-600"
            >
              Change Password
            </button>
            {passwordSuccess && (
              <div className="mt-4 text-center text-green-600">
                Reset password instructions sent to email associated with this
                account!
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default EditAccount;

"use client";

import React, { FormEvent, useState } from "react";
import StandardButton from "./button";
import { useRouter } from "next/navigation";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const navigateLogin = async () => {
    try {
      console.log("go to login page");
      router.push("/user/login");
    } catch (error) {
      console.error("Error going to login page:", error);
    }
  };

  const resetPassword = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const user_info = {
        email: email,
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
      setSuccess(true);
      console.log("Successfully reset password");
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-5 bg-white shadow-lg rounded-lg">
      {success ? (
        <div className="text-center">
          <div className="text-lg font-semibold text-green-600 mb-4">
            Password reset! Check your email for instructions
          </div>
          <button
            onClick={navigateLogin}
            className="px-4 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600"
          >
            Back to Login
          </button>
        </div>
      ) : (
        <form onSubmit={resetPassword} className="space-y-4">
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="text"
              name="email"
              value={email || ""}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-500 text-white font-medium rounded hover:bg-green-600"
          >
            Reset Password
          </button>
        </form>
      )}
    </div>
  );
}

export default ResetPassword;

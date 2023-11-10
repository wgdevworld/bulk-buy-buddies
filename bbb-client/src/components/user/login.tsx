"use client";

import React, { FormEvent, useState, useEffect } from "react";
import Logout from "@/components/user/logout";
import { useRouter } from 'next/navigation';
import Link from 'next/link'
// =======
// import StandardButton from "./button";
// import { useRouter } from "next/navigation"; 
// >>>>>>> main

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
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
                "Content-Type": "application/json"
            }
          })
          const user_acct = await response.json();
          
          if (user_acct != null) {
            //TODO: navigate to landing page afterwards 
            setUsername(user_acct['firstname'])
            setSuccess(true)
            router.push('/user/account')
          }
          console.log(user_acct)
          } catch (error) {
            console.error(error);
          }
    }

    const loginUser = async (e: FormEvent) => {
        e.preventDefault()

        try {
            const user_info = {
                'email': username,
                'password': password 
            };
            console.log(user_info)
            const response = await fetch("http://127.0.0.1:5000/login", {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user_info),
            })
            console.log(response)
            if (!response.ok) {
                throw new Error("Failed to login");
            }
            console.log(response.json())
            setSuccess(true)
            console.log("Successfully logged in")
            router.push('/user/account')
        } catch (error) {
            console.error("Error logging in:", error);
        }
// =======
//   const loginUser = async (e: FormEvent) => {
//     e.preventDefault();

//     try {
//       const user_info = {
//         email: username,
//         password: password,
//       };
//       console.log(user_info);
//       const response = await fetch("http://127.0.0.1:5000/login", {
//         credentials: "include",
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(user_info),
//       });
//       console.log(response);
//       if (!response.ok) {
//         throw new Error("Failed to login");
//       }
//       console.log(response.json());
//       setSuccess(true);
//       console.log("Successfully logged in");
//     } catch (error) {
//       console.error("Error logging in:", error);
// >>>>>>> main
    }
//   };

    // const navigateRegistration = async () => {
    //     try {
    //         console.log("go to registration page")
    //         router.push('/user/register')
    //     } catch (error) {
    //         console.error("Error going to registration page:", error);
    //     }
    // }

    // const resetPassword = async () => {
    //     try {
    //         console.log("go to reset password")
    //         router.push('/user/resetPassword')
    //     } catch (error) {
    //         console.error("Error going to reset password page:", error);
    //     }
    // }

    // const navigateAccount = async () => {
    //     try {
    //         console.log("go to account page")
    //         router.push('/user/account')
    //     } catch (error) {
    //         console.error("Error going to account page:", error);
    //     }
    // }

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=blue&shade=600"
            alt="Your Company"
          />
          <h1 className="mt-20 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Welcome to Bulk Buy Buddies!
          </h1>
          <p className="mt-2 text-center leading-9 tracking-tight text-gray-900">
            Save money and be eco-friendly with your Costco groceries by splitting your items with other shoppers
          </p>
          <h2 className="mt-10 text-center text-xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to find your buddy
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action="#" method="POST" onSubmit={loginUser}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  type="email" 
                  name="email" 
                  value={username || ""} 
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <Link href="/user/resetPassword" className="font-semibold text-blue-600 hover:text-blue-500"> 
                    Forgot password? 
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  type="password" 
                  name="password" 
                  value={password || ""} 
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a buddy?{' '}
            <Link href="/user/register" className="font-semibold leading-6 text-blue-600 hover:text-blue-500">
                Create an Account
            </Link>
          </p>
        </div>
      </div>
    )
// =======
//   const navigateRegistration = async () => {
//     try {
//       console.log("go to registration page");
//       router.push("/user/register");
//     } catch (error) {
//       console.error("Error going to registration page:", error);
//     }
//   };

//   const resetPassword = async () => {
//     try {
//       router.push("/user/resetPassword");
//       console.log("go to reset password");
//     } catch (error) {
//       console.error("Error going to reset password page:", error);
//     }
//   };

//   const navigateAccount = async () => {
//     try {
//       console.log("go to account page");
//       router.push("/user/account");
//     } catch (error) {
//       console.error("Error going to account page:", error);
//     }
//   };

//   return (
//     <div>
//       {success ? (
//         <div>
//           <div> Successfully logged in! </div>
//           <div>
//             <h1> Welcome, {username}</h1>
//             <StandardButton onClick={navigateAccount} label="View Account" />
//           </div>
//           <Logout />
//         </div>
//       ) : (
//         <nav>
//           <form onSubmit={loginUser}>
//             <div>
//               <label>Email</label>
//               <input
//                 type="text"
//                 name="email"
//                 value={username || ""}
//                 onChange={(e) => setUsername(e.target.value)}
//               />
//             </div>
//             <div>
//               <label>Password</label>
//               <input
//                 type="password"
//                 name="password"
//                 value={password || ""}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>
//             <button type="submit"> Login </button>
//           </form>
//           <StandardButton
//             onClick={navigateRegistration}
//             label="Create an Account"
//           />
//           <StandardButton onClick={resetPassword} label="Forgot Password?" />
//         </nav>
//       )}
//     </div>
//   );
// >>>>>>> main
}

export default Login;

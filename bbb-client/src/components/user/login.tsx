"use client";

import React, { FormEvent, useState, useEffect } from "react";
import Logout from "@/components/user/logout";
import StandardButton from './button';
import { useRouter } from 'next/navigation';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [success, setSuccess] = useState(false);
    const router = useRouter()

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
            // router.push('/user/account')
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
        } catch (error) {
            console.error("Error logging in:", error);
        }
    }

    const navigateRegistration = async () => {
        try {
            console.log("go to registration page")
            router.push('/user/register')
        } catch (error) {
            console.error("Error going to registration page:", error);
        }
    }

    const resetPassword = async () => {
        try {
            router.push('/user/resetPassword')
            console.log("go to reset password")
        } catch (error) {
            console.error("Error going to reset password page:", error);
        }
    }

    const navigateAccount = async () => {
        try {
            console.log("go to account page")
            router.push('/user/account')
        } catch (error) {
            console.error("Error going to account page:", error);
        }
    }

    return (
        <div>
            {success ?
                <div> 
                    <div> Successfully logged in! </div>
                    <div> 
                        <h1> Welcome, {username}</h1>
                        <StandardButton onClick={navigateAccount} label="View Account" />
                    </div>
                    <Logout />
                </div>
                :
                <nav>
                <form onSubmit={loginUser}>
                    <div>
                        <label>Email</label>
                        <input 
                            type="text" 
                            name="email" 
                            value={username || ""} 
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                    <label>Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            value={password || ""} 
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit"> Login </button>
                </form>
                <StandardButton onClick={navigateRegistration} label="Create an Account" />
                <StandardButton onClick={resetPassword} label="Forgot Password?" />
                </nav>
            }
        </div>
    )
}

export default Login;
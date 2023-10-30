import React, { FormEvent, useState, useEffect } from "react";
import Logout from "@/components/user/logout";
import StandardButton from './button';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [success, setSuccess] = useState(false);

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
        } catch (error) {
            console.error("Error going to registration page:", error);
        }
    }

    const resetPassword = async () => {
        try {
            console.log("go to reset password")
        } catch (error) {
            console.error("Error going to reset password page:", error);
        }
    }

    return (
        <div>
            {success ?
                <div> 
                    <div> Successfully logged in! </div>
                    <div> 
                        <h1> Welcome, {username}</h1>
                    </div>
                    <Logout />
                </div>
                :
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
                    <StandardButton onClick={navigateRegistration} label="Create an Account" />
                    <StandardButton onClick={resetPassword} label="Forgot Password?" />
                </form>
            }
        </div>
    )
}

export default Login;
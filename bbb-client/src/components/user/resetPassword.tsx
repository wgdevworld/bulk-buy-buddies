"use client";

import React, { FormEvent, useState } from "react";
import StandardButton from './button';
import { useRouter } from 'next/navigation';

function ResetPassword() {
    const [email, setEmail] = useState("");
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const navigateLogin = async () => {
        try {
            console.log("go to login page")
            router.push('/user/login')
        } catch (error) {
            console.error("Error going to login page:", error);
        }
    }

    const resetPassword = async (e: FormEvent) => {
        e.preventDefault()

        try {
            const user_info = {
                'email': email,
            };
            console.log(user_info)
            const response = await fetch("http://127.0.0.1:5000/reset_password", {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user_info),
            })
            console.log(response)
            if (!response.ok) {
                throw new Error("Failed to reset password");
            }
            console.log(response.json())
            setSuccess(true)
            console.log("Successfully reset password")
        } catch (error) {
            console.error("Error resetting password:", error);
        }
    }

    return (
        <div>
            {success ?
                <div> 
                    <div> Password reset! Check your email for instructions </div>
                    <StandardButton onClick={navigateLogin} label="Back to Login" />
                </div>
                :
                <form onSubmit={resetPassword}>
                    <div>
                        <label>Email</label>
                        <input 
                            type="text" 
                            name="email" 
                            value={email || ""} 
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <button type="submit"> Reset Password </button>
                </form>
            }
        </div>
    )
}

export default ResetPassword;
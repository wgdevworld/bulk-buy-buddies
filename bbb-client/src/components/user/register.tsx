"use client";

import React, { FormEvent, useState } from "react";
import Logout from "@/components/user/logout";
import ShopperDropdown from "../ShopperForm/ShopperDropdown";
import StandardButton from './button';
import { useRouter } from 'next/navigation';

export const states = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado",
"Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana",
"Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
"Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
"New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma",
"Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee",
"Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"]


function Register() {
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [success, setSuccess] = useState(false);
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipcode, setZipcode] = useState("");
    const router = useRouter()


    const registerUser = async (e: FormEvent) => {
        e.preventDefault()

        try {
            const user_info = {
                'firstname': firstname,
                'lastname': lastname,
                'email': username,
                'password': password,
                'address': {
                    'address': address,
                    'city': city,
                    'state': state,
                    'zipcode': zipcode
                }
            };
            console.log(user_info)
            const response = await fetch("http://127.0.0.1:5000/register", {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user_info),
            })
            console.log(response)
            console.log(response.json())

            if (!response.ok) {
                throw new Error("Failed to register user");
            }
            console.log("registered new user")
            setSuccess(true)
        } catch (error) {
            console.error("Error creating user:", error);
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
                <form onSubmit={registerUser}>
                    <div>
                        <label>First Name</label>
                        <input 
                            type="text" 
                            name="firstname" 
                            value={firstname || ""} 
                            onChange={(e) => setFirstname(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Last Name</label>
                        <input 
                            type="text" 
                            name="lastname" 
                            value={lastname || ""} 
                            onChange={(e) => setLastname(e.target.value)}
                        />
                    </div>
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
                    <div>
                        <label>Address</label>
                        <input 
                            type="text" 
                            name="email" 
                            value={address || ""} 
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>City / Town</label>
                        <input 
                            type="text" 
                            name="email" 
                            value={city || ""} 
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </div>
                    <ShopperDropdown
                        name="State"
                        options={states}
                        value={state}
                        onSelect={(selectedLocation) => setState(selectedLocation)}
                    />
                    <div>
                        <label>Zip / Postal Code</label>
                        <input 
                            type="text" 
                            name="email" 
                            value={zipcode || ""} 
                            onChange={(e) => setZipcode(e.target.value)}
                        />
                    </div>
                    <button type="submit"> Register </button>
                </form>
            }
        </div>
    )
}

export default Register;
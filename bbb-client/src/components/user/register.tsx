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
        <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Register</h2>
                <p className="mt-2 text-lg leading-8 text-gray-600">Become a bulk buy buddy today!</p>
            </div>
            <form className="mx-auto mt-10 max-w-xl sm:mt-15 items-center justify-center lg:mx-auto lg:w-full lg:max-w-lg">
                <div className="space-y-12">
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <label className="block text-sm font-medium leading-6 text-gray-900">First name</label>
                                <div className="mt-2">
                                    <input type="text" name="first-name" id="first-name" 
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label className="block text-sm font-medium leading-6 text-gray-900">Last name</label>
                                <div className="mt-2">
                                    <input type="text" name="last-name" id="last-name" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                                </div>
                            </div>

                            <div className="sm:col-span-4">
                                <label className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                                <div className="mt-2">
                                    <input id="email" name="email" type="email" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label className="block text-sm font-medium leading-6 text-gray-900">Country</label>
                                <div className="mt-2">
                                    <select id="country" name="country" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                                        <option>United States</option>
                                        <option>Canada</option>
                                        <option>Mexico</option>
                                    </select>
                                </div>
                            </div>

                            <div className="col-span-full">
                                <label className="block text-sm font-medium leading-6 text-gray-900">Street address</label>
                                <div className="mt-2">
                                    <input type="text" name="street-address" id="street-address" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                                </div>
                            </div>

                            <div className="sm:col-span-2 sm:col-start-1">
                                <label className="block text-sm font-medium leading-6 text-gray-900">City</label>
                                <div className="mt-2">
                                    <input type="text" name="city" id="city" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium leading-6 text-gray-900">State / Province</label>
                                <div className="mt-2">
                                    <input type="text" name="region" id="region" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium leading-6 text-gray-900">ZIP / Postal code</label>
                                <div className="mt-2">
                                    <input type="text" name="postal-code" id="postal-code" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                                </div>
                            </div>
                        </div>
                </div>
                <div className="mt-10 flex items-center justify-end gap-x-6">
                    <button type="button" className="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
                    <button type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Register</button>
                </div>
            </form>
        </div>
    )
            {/* <div>
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
            </div> */}
}

export default Register;
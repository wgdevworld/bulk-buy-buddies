"use client";

import React, { FormEvent, useState, useEffect } from "react";
import ShopperDropdown from "../ShopperForm/ShopperDropdown";
import StandardButton from './button';
import { Location } from "../locations/locations";
import { Account } from "@/components/user/account"
import { useRouter } from 'next/navigation';

function EditAccount() {
    
    const [user, setUser] = useState<Account>();
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [editSuccess, setEditSuccess] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [location, setLocation] = useState("");
    const [locations, setLocations] = useState<string[]>([]);
    const router = useRouter()
 

    useEffect(() => {
        getLocations();
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
          console.log(user_acct)
        //   setUser(user_acct)
          return user_acct
          } catch (error) {
            console.error(error);
          }
    }


    const getLocations = async () => {
        try {
          const response = await fetch("http://127.0.0.1:5000/retrieve_locations_temp", {
            credentials: "include",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
          })
          const data: Location[] = await response.json();
          var locs: string[]
          locs = []
          data.forEach(loc => {
            const display = `${loc.name} (${loc.address})`
            locs.push(display)
          });
          setLocations(locs)
        } catch (error) {
          console.error(error);
        }
    }

    const resetPassword = async () => {
        try {
            console.log("account reset password")
            const user_info = {
                'email': user?.email,
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
            setPasswordSuccess(true)
            console.log("Reset password instructions sent to email associated with this account!")
        } catch (error) {
            console.error("Error resetting password:", error);
        }
    }

    const updateInfo = async (e: FormEvent) => {
        e.preventDefault()

        try {
            const user_info = {
                'firstname': firstname == "" ? user?.firstname : firstname,
                'lastname': lastname == "" ? user?.lastname : lastname,
                'location': location == "" ? user?.location : location
            };
            console.log(user_info)
            const response = await fetch("http://127.0.0.1:5000/updateAccount", {
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
                throw new Error("Failed to edit user info");
            }
            console.log("edit user info")
            setEditSuccess(true)
        } catch (error) {
            console.error("Error editing user info:", error);
        }
    }

    const navigateAccountPage = async () => {
        try {
            console.log("go to account page")
            router.push('/user/account')
        } catch (error) {
            console.error("Error going to account page:", error);
        }
    }

    return (
        <div>
            {editSuccess ?
                <div> 
                    <div> Information Updated </div>
                    <StandardButton onClick={navigateAccountPage} label="Back to Account" />
                </div>
                :
                <div>
                    <form onSubmit={updateInfo}>
                        <div>
                            <label>First Name</label>
                            <input 
                                type="text"
                                name="firstname" 
                                value={firstname || user?.firstname} 
                                onChange={(e) => setFirstname(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Last Name</label>
                            <input 
                                type="text" 
                                name="lastname" 
                                value={lastname || user?.lastname} 
                                onChange={(e) => setLastname(e.target.value)}
                            />
                        </div>
                        <ShopperDropdown
                            name="New Location"
                            options={locations}
                            value={location}
                            onSelect={(selectedLocation) => setLocation(selectedLocation)}
                        />
                        <button type="submit"> Update Information </button>
                    </form>
                    <StandardButton onClick={resetPassword} label="Forgot Password?" />
                    <div>
                    {passwordSuccess ? 
                        <div> 
                            <div> Reset password instructions sent to email associated with this account!  </div>
                        </div>
                        :
                        <div/>
                    }
                    </div>
                </div>
            }  
        </div>
    )
}

export default EditAccount;
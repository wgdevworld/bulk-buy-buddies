import React, { FormEvent, useState, useEffect } from "react";
import Login from "@/components/user/login";
import ShopperDropdown from "../ShopperForm/ShopperDropdown";
import { Location } from "../locations/locations";

function Register() {
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [success, setSuccess] = useState(false);
    const [location, setLocation] = useState("");
    const [locations, setLocations] = useState<string[]>([]);

    useEffect(() => {
        getLocations();
    }, []);

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
            locs.push(loc.name)
          });
          setLocations(locs)
        } catch (error) {
          console.error(error);
        }
    }

    const registerUser = async (e: FormEvent) => {
        e.preventDefault()

        try {
            const user_info = {
                'firstname': firstname,
                'lastname': lastname,
                'email': username,
                'password': password,
                'location': location
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

    return (
        <div>
            {success ?
                <div> 
                    Successfully registered! Log in to find your bbb!
                    <Login />
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
                    <ShopperDropdown
                        name="Location"
                        options={locations}
                        value={location}
                        onSelect={(selectedLocation) => setLocation(selectedLocation)}
                    />
                    <button type="submit"> Register </button>
                </form>
            }
        </div>
    )
}

export default Register;
import React, { FormEvent, useState } from "react";
import Login from "@/components/user/login"

function Register() {
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [success, setSuccess] = useState(false);

    const registerUser = async (e: FormEvent) => {
        e.preventDefault()

        try {
            const user_info = {
                'firstname': firstname,
                'lastname': lastname,
                'email': username,
                'password': password 
            };
            console.log(user_info)
            const response = await fetch("http://127.0.0.1:5000/register", {
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
                        <label>Username</label>
                        <input 
                            type="text" 
                            name="username" 
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
                    <button type="submit"> Register </button>
                </form>
            }
        </div>
    )
}

export default Register;
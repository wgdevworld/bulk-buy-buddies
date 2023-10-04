import React, { FormEvent, useState } from "react";

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
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user_info),
            })
            // .then(() => {
            //     setSuccess(true)
            // })
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

    return (
        <div>
            {success ?
                <div> 
                    <div> Successfully logged in! </div>
                    <div> 
                        <h1> Welcome, firstname lastname</h1>
                    </div>

                </div>
                :
                <form onSubmit={loginUser}>
                    <div>
                        <label>Username/email</label>
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
                            type="text" 
                            name="password" 
                            value={password || ""} 
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit"> Login </button>
                </form>
            }
        </div>
    )
}

export default Login;
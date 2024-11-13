import React, { useState, useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { z } from 'zod';

// Zod schema for validation
const schema = z.object({
    email: z.string().email("Enter a valid Email"),
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[\W_]/, "Password must contain at least one special character"),
});

function EmployeeLogin() {
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState({});
    const [successMsg, setSuccessMsg] = useState("");
    const [data, setData] = useState({
        email: "",
        password: ""
    });

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value,
        });

        try {
            schema.pick({ [name]: true }).parse({ [name]: value });
            setErrorMsg((prevErrors) => ({
                ...prevErrors,
                [name]: "",
            }));
        } catch (err) {
            setErrorMsg((prevErrors) => ({
                ...prevErrors,
                [name]: err.errors[0].message,
            }));
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const validation = schema.safeParse(data);

            if (!validation.success) {
                const errorMessages = validation.error.errors.reduce((acc, err) => {
                    acc[err.path[0]] = err.message;
                    return acc;
                }, {});
                setErrorMsg(errorMessages);
                setSuccessMsg("");
            } else {
                const response = await axios.post("/api/employee/login", data);

                if (!response.data.token) {
                    if (response.data === "User not Exist") {
                        // navigate("/Signup")
                    } else {
                        setErrorMsg({ form: response.data || "Login failed!" });
                        setSuccessMsg("");
                    }
                } else {
                    console.log(response.data.token)
                    localStorage.setItem("token", response.data.token);
                    setSuccessMsg("Login successful!");
                    navigate("/")
                    window.location.reload();
                    setErrorMsg({});
                }
            }
        } catch (err) {
            console.error(err);
            setErrorMsg({ form: "An unexpected error occurred. Please try again." });
            setSuccessMsg("");
        }
    };

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-100 -mt-4'>
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
                <h1 className='text-3xl font-bold text-center text-gray-800 mb-6'>Login</h1>
                {successMsg && <p className="text-center text-green-500 font-medium mb-4">{successMsg}</p>}
                {errorMsg.form && <p className="text-center text-red-500 font-medium mb-4">{errorMsg.form}</p>}
                <form onSubmit={handleSubmit}>
                    <div className='flex flex-col'>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="email">Email</label>
                            <input
                                className={`shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 ${errorMsg.email ? "border-red-500" : "border-gray-300"}`}
                                type="text"
                                id='email'
                                placeholder='Enter Email'
                                name='email'
                                value={data.email}
                                onChange={handleChange}
                            />
                            {errorMsg.email && <p className="text-red-500 text-xs italic">{errorMsg.email}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="password">Password</label>
                            <input
                                className={`shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 ${errorMsg.password ? "border-red-500" : "border-gray-300"}`}
                                type="password"
                                id='password'
                                placeholder='Enter Password'
                                name='password'
                                value={data.password}
                                onChange={handleChange}
                            />
                            {errorMsg.password && <p className="text-red-500 text-xs italic">{errorMsg.password}</p>}
                        </div>

                        <button
                            className="bg-customBlue hover:bg-customBlue2 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500 mt-2"
                            type="submit"
                        >
                            Submit
                        </button>
                    </div>
                </form>
                {/* <hr className='my-4' />
                <div>
                    <Link
                        to="/AdminLogin"
                        className="w-full text-blue-800 text-center border-blue-500 border-2 hover:bg-blue-700 hover:text-white py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 block"
                    >
                        Login As Admin
                    </Link>
                </div> */}
            </div>
        </div>
    );
}

export default EmployeeLogin;

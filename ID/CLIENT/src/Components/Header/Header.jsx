import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import Logo from '../../assets/visiotrixLogo.png';
import axios from 'axios';

const Header = ({ toggleNavbar }) => {
    const navigate = useNavigate();
    const [token, setToken] = useState(null)
    const [clockedSts, setClockedSts] = useState(0)
    
    let getLogStatus = async () => {
        if (!token) return;
        try {
            let response = await axios.get("http://192.168.0.252:5000/api/empolyeeportal/logstatus", {
                headers: {
                    Authorization: `${token}`,
                },
            })
            
            if(response.data.logStatus) {
                console.log(response.data.success)
                setClockedSts(response.data.logStatus)
            }
        } catch (err) {
            console.log(err)
        }
    }
    
    let handleLogout = async () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You want to Logout",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Logout!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await Swal.fire({
                    title: "Logged Out!",
                    text: "You have Successfully Logged Out.",
                    icon: "success",
                    timer: 2000,
                });
                localStorage.removeItem('token');
                navigate("/Login")
                window.location.reload();
            }
        });
    };

    let handleTimeIn = async () => {
        try {
            let response = await axios.post("http://192.168.0.252:5000/api/empolyeeportal/timein", {},
                {
                  headers: {
                      Authorization: `${token}`,
                    },
                }
            )

            if(response.data.success) {
                console.log(response.data.success)
                setClockedSts(1);
                Swal.fire({
                    title: "Welcome to ICONA!",
                    text: response.data.success,
                    icon: "success"
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Sorry",
                    text: response.data.error,
                });
            }
        } catch (err) {
            console.log(err);
        }
    }
    
    let handleTimeOut = async () => {
        try {
            let response = await axios.post("http://192.168.0.252:5000/api/empolyeeportal/timeout", {},
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            )
            
            if(response.data.success) {
                console.log(response.data.success)
                setClockedSts(2);
                Swal.fire({
                    title: "Logout to ICONA!",
                    text: response.data.success,
                    icon: "success"
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Sorry",
                    text: response.data.error,
                });
            }
        } catch (err) {
            console.log(err);
        }
    }
    
    useEffect(() => {
        setToken(localStorage.getItem('token'))
        getLogStatus()
    }, [token, clockedSts])

    return (
        <header className="h-16 flex items-center bg-customBlue justify-between px-4 shadow-md fixed w-full top-0 left-0 z-20">
            <div className="flex items-center">
                {/* Hamburger Icon for Mobile */}
                <button
                    className="text-white focus:outline-none"
                    onClick={toggleNavbar}
                >
                    <i className="fa-solid fa-bars"></i>
                </button>

                {/* Logo or Company Name */}
                <Link to="/" className="flex items-center ml-4">
                    {/* <img src={Logo} alt="Logo" className="h-10" /> */}
                    <h1 className="text-2xl font-bold ml-2 text-white">VISIOTRIX</h1>
                </Link>
            </div>

            <div className="flex items-center space-x-4">
                {/* <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold">
                    Notifications
                </button> */}
                {
                    token ? 
                    <div className='flex gap-4'>
                        {
                            clockedSts == 1 ? 
                                <button className="px-4 py-2 bg-white hover:bg-gray-400 rounded text-black font-semibold" onClick={handleTimeOut}>
                                Time Out
                                </button> : 
                                clockedSts == 2 ?
                                    "" : <button className="px-4 py-2 bg-white hover:bg-gray-400 rounded text-black font-semibold" onClick={handleTimeIn}>
                                            Time In
                                        </button>
                        }
                        <button className="px-4 py-2 bg-white hover:bg-gray-400 rounded text-black font-semibold" onClick={handleLogout}>
                            Logout
                        </button>
                    </div> :
                    <Link to="/Login" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white font-semibold">
                        Login
                    </Link>
                }
            </div>
        </header>
    );
};

export default Header;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo4 from '../../assets/Logo5.png'
import Swal from "sweetalert2";
import axios from 'axios';

const Header = ({ toggleNavbar }) => {
    const navigate = useNavigate();
    const [token, setToken] = useState(null)
    
    useEffect(() => {
        setToken(localStorage.getItem('token'))
        // getLogStatus()
    }, [token])

    return (
        <nav className="h-16 flex items-center bg-customBlue justify-between px-4 shadow-md fixed w-full top-0 left-0 z-20">
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
                    {/* <img src={Logo3} alt="Logo" className="h-16 rounded" /> */}
                    <img src={Logo4} alt="Logo" className="h-16 filter brightness-0 invert contrast-200" />
                    {/* <h1 className="text-2xl font-bold ml-2 text-white">VISIOTRIX</h1> */}
                </Link>
            </div>
        </nav>
    );
};

export default Header;

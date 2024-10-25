import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AssignWorkPopup from '../AssignWorkPopup/AssignWorkPopup ';
import Header from '../Header/Header';
import { jwtDecode } from "jwt-decode";

const Navbar = ({ isOpen, toggleNavbar }) => {
    const token = localStorage.getItem('token');
    const [openPopup, setOpenPopup] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token); 
                // console.log(decodedToken); 
                
                const role = decodedToken.role;
                setUserRole(role);
                console.log(`User role: ${role}`);
            } catch (error) {
                console.error('Failed to decode token', error);
            }
        }
    }, []);

    const handleAssignPopup = () => {
        setOpenPopup(true);
    };

    return (
        <div>
            <Header toggleNavbar={toggleNavbar} />

            {/* Side Navbar */}
            <nav
                className={`h-screen transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-0'} overflow-hidden`}
                style={{ zIndex: 10 }}
            >
                <div className={`flex items-center justify-center h-20 ${isOpen ? 'block' : 'hidden'}`}>
                    <Link to="/">
                        {/* <h1 className="text-xl font-bold">VISIOTRIX</h1> */}
                    </Link>
                </div>
                {isOpen && (
                    <div className="flex flex-col space-y-4 mt-6 px-4">
                        <Link to="/" className="flex items-center justify-center px-4 py-2 bg-customBlue hover:bg-blue-600 rounded text-white font-semibold">
                            <i className="fa-solid fa-list-check"></i>
                            <span className='ml-3'>Work</span>
                        </Link>
                        {userRole === 'Admin' && ( // Use strict equality
                            <>
                                <button
                                    className="px-4 py-2 bg-customBlue hover:bg-blue-600 rounded text-white font-semibold"
                                    onClick={handleAssignPopup}
                                >
                                    <i className="fa-solid fa-user-pen"></i>
                                    <span className='ml-3'>Assign Task</span>
                                </button>
                                <Link
                                    to="/AllWorks"
                                    className="px-4 py-2 text-center bg-customBlue hover:bg-blue-600 rounded text-white font-semibold"
                                >
                                    Assigned Work
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </nav>

            {/* Popup for Assign Task */}
            {openPopup && <AssignWorkPopup closePopup={setOpenPopup} />}
        </div>
    );
};

export default Navbar;

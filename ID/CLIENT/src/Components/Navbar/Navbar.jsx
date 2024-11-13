import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AssignWorkPopup from "../AssignWorkPopup/AssignWorkPopup ";
import Header from "../Header/Header";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Swal from "sweetalert2";

const Navbar = ({ isOpen, toggleNavbar }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [openPopup, setOpenPopup] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [clockedSts, setClockedSts] = useState(0);
    const [jobCategory, setJobCategory] = useState([]);

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                // console.log(decodedToken);

                const role = decodedToken.role;
                setUserRole(role);
                getLogStatus();
                getJobCategory();
                console.log(`User role: ${role}`);
            } catch (error) {
                console.error("Failed to decode token", error);
            }
        }
    }, [token, clockedSts]);

    let getJobCategory = async () => {
        try {
            let response = await axios.get(
                "/api/empolyeeportal/jobcategory",
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );

            setJobCategory(response.data);
            // console.log(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    let getLogStatus = async () => {
        if (!token) return;
        try {
            let response = await axios.get(
                "/api/empolyeeportal/logstatus",
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );

            if (response.data.logStatus) {
                console.log(response.data.success);
                setClockedSts(response.data.logStatus);
            }
        } catch (err) {
            console.log(err);
        }
    };

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
                toggleNavbar()
                await Swal.fire({
                    title: "Logged Out!",
                    text: "You have Successfully Logged Out.",
                    icon: "success",
                    timer: 2000,
                });
                localStorage.removeItem("token");
                navigate("/Login");
                window.location.reload();
            }
        });
    };

    let handleTimeIn = async (jobCategory) => {
        try {
            // console.log(jobCategory);
            toggleNavbar()
            let response = await axios.post(
                "/api/empolyeeportal/timein",
                { jobCategory },
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );

            if (response.data.success) {
                console.log(response.data.success);
                setClockedSts(1);
                Swal.fire({
                    title: "Welcome to ICONA!",
                    text: response.data.success,
                    icon: "success",
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
    };

    let handleTimeOut = async () => {
        try {
            toggleNavbar()
            let response = await axios.post(
                "/api/empolyeeportal/timeout",
                {},
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );

            if (response.data.success) {
                // console.log(response.data.success)
                setClockedSts(2);
                Swal.fire({
                    title: "Logout to ICONA!",
                    text: response.data.success,
                    icon: "success",
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
    };

    const handleAssignPopup = () => {
        toggleNavbar()
        setOpenPopup(true);
    };

    return (
        <div>
            <Header toggleNavbar={toggleNavbar} />

            {/* Side Navbar */}
            <nav
                className={`h-screen bg-white fixed transition-all duration-300 ease-in-out ${isOpen ? "w-64" : "w-0"
                    } overflow-hidden`}
                style={{ zIndex: 10 }}
            >
                <div
                    className={`flex items-center justify-center h-20 ${isOpen ? "block" : "hidden"
                        }`}
                >
                    <Link to="/">
                        {/* <h1 className="text-xl font-bold">VISIOTRIX</h1> */}
                    </Link>
                </div>
                {isOpen && (
                    <div className="flex flex-col space-y-4 mt-6 px-4">
                        {token ? (
                            <div className="flex flex-col gap-4">
                                {clockedSts == 1 ? (
                                    <button
                                        className="px-4 py-2 bg-customBlue hover:bg-customBlue2 rounded text-white font-semibold"
                                        onClick={handleTimeOut}
                                    >
                                        Time Out
                                    </button>
                                ) : clockedSts == 2 ? (
                                    ""
                                ) : (
                                    <div>
                                        {/* <button className="px-4 py-2 bg-customBlue hover:bg-customBlue2 rounded text-white font-semibold">
                                                        Time In
                                                    </button> */}
                                        <div className="">
                                            <select
                                                className="w-full border border-gray-300 rounded px-3 py-2 mt-1 bg-customBlue text-white font-semibold"
                                                name=""
                                                id=""
                                                onChange={(e) => handleTimeIn(e.target.value)}
                                            >
                                                <option
                                                    value=""
                                                    className="w-full text-center border border-gray-300 rounded px-3 py-2 mt-1"
                                                >
                                                    Select Job Type
                                                </option>
                                                {jobCategory &&
                                                    jobCategory.map((job) => (
                                                        <option
                                                            value={job.JobCateroryNo}
                                                            key={job.JobCateroryNo}
                                                        >
                                                            {job.JobCategoryName}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                    </div>
                                )}
                                <Link
                                    to="/"
                                    className="flex items-center justify-center px-4 py-2 bg-customBlue hover:bg-customBlue2 rounded text-white font-semibold"
                                    onClick={toggleNavbar}
                                >
                                    <i className="fa-solid fa-list-check"></i>
                                    <span className="ml-3">Work</span>
                                </Link>
                                <Link
                                    to="/SiteVisit"
                                    className="flex items-center justify-center px-4 py-2 bg-customBlue hover:bg-customBlue2 rounded text-white font-semibold"
                                    onClick={toggleNavbar}
                                >
                                    <span className="ml-3">Site Visit</span>
                                </Link>
                                {userRole === "Admin" && (
                                    <>
                                        <button
                                            className="px-4 py-2 bg-customBlue hover:bg-customBlue2 rounded text-white font-semibold"
                                            onClick={handleAssignPopup}
                                        >
                                            <i className="fa-solid fa-user-pen"></i>
                                            <span className="ml-3">Assign Task</span>
                                        </button>
                                        <Link
                                            to="/AllWorks"
                                            className="px-4 py-2 text-center bg-customBlue hover:bg-customBlue2 rounded text-white font-semibold"
                                            onClick={toggleNavbar}
                                        >
                                            Assigned Work
                                        </Link>
                                        <Link
                                            to="/SiteImages"
                                            className="px-4 py-2 text-center bg-customBlue hover:bg-customBlue2 rounded text-white font-semibold"
                                            onClick={toggleNavbar}
                                        >
                                            Site Images
                                        </Link>
                                        <Link
                                            to="/DailyEmployeeEntry"
                                            className="px-4 py-2 text-center bg-customBlue hover:bg-customBlue2 rounded text-white font-semibold"
                                            onClick={toggleNavbar}
                                        >
                                            Today Presence
                                        </Link>
                                    </>
                                )}
                                <button
                                    className="px-4 py-2 bg-customBlue hover:bg-customBlue2 rounded text-white font-semibold"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/Login"
                                className="px-4 py-2 text-center bg-customBlue hover:bg-customBlue2 rounded text-white font-semibold"
                                onClick={toggleNavbar}
                            >
                                Login
                            </Link>
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

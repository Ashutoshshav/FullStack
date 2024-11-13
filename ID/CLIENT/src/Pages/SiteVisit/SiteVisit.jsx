import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function SiteVisit(props) {
    const [files, setFile] = useState([]);
    const token = localStorage.getItem("token");
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [locationReady, setLocationReady] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // console.log(navigator)
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                    setLocationReady(true);
                },
                (error) => {
                    Swal.fire({
                        title: "Is your Location on?",
                        text: "First on your Location",
                        icon: "question",
                    });
                    // console.error("Error getting location:", error);
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }, [files]);

    const handleFileChange = (e) => {
        setFile(Array.from(e.target.files));
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Select at least one Image",
            });
            return;
        }

        const formData = new FormData();
        files.forEach((file) => {
            formData.append("employeeImage", file);
        });

        if (locationReady) {
            formData.append("location", JSON.stringify(location));
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Your Location is not on",
            });
            console.warn("Location is not ready yet, proceeding without it.");
            return;
        }
        try {
            setLoading(true);
            const response = await axios.post(
                "/api/empolyeeportal/site-image",
                formData,
                {
                    headers: {
                        Authorization: `${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            Swal.fire({
                title: "Submitted!",
                text: response.data.message,
                icon: "success",
                timer: 2000,
            });
            setFile([]);
            // alert(response.data.message);

            // console.log(formData);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Try again",
                text: "Something went wrong!",
            });
            console.error("Error uploading image:", error);
            // alert("Failed to upload image");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex-none sm:flex">
                <label
                    htmlFor="file-upload"
                    className="flex w-full sm:w-auto justify-center items-center"
                >
                    <span className="sr-only">Choose Photo</span>
                    <input
                        type="file"
                        id="file-upload"
                        multiple
                        onChange={handleFileChange}
                        accept="image/*"
                        className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-violet-50 file:text-customBlue
                        hover:file:bg-violet-100"
                    />
                </label>
                <button
                    className={`w-full my-3 sm:w-auto px-5 py-2 rounded-3xl text-white hover:bg-customBlue2 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 ${loading ? "bg-customBlue2" : "bg-customBlue"
                        }`}
                    onClick={handleUpload}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <svg
                                className="w-5 h-5 animate-spin inline-block mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <circle cx="12" cy="12" r="10" strokeWidth="4" />
                            </svg>
                            Uploading...
                        </>
                    ) : (
                        'Upload Image'
                    )}
                </button>
            </div>
            {locationReady && (
                <p className="text-center text-customBlue font-bold">
                    Location: {location.latitude}, {location.longitude}
                </p>
            )}{" "}
            {/* Show location if ready */}
        </div>
    );
}

export default SiteVisit;

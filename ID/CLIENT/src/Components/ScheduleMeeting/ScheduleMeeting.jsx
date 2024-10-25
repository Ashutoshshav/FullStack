import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

function ScheduleMeeting({ closePopup }) {
    const [isOpen, setIsOpen] = useState(false);
    const [meetingLocation, setMeetingLocation] = useState("");
    const [meetingDescription, setMeetingDescription] = useState("");
    const [meetingDTime, setMeetingDTime] = useState("");
    const [token, setToken] = useState(null);
    const [errorMsg, setErrorMsg] = useState({
        error: "",
        success: "",
    });

    useEffect(() => {
        setToken(localStorage.getItem("token"));
    })

    const toggleModal = () => {
        closePopup(false);
    };

    const handleSubmit = async () => {
        try {
            const assignedWork = { meetingLocation, meetingDescription, meetingDTime };
            let response = await axios.post(
                "http://192.168.0.252:5000/api/meeting/schedulemeeting",
                assignedWork,
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                },
            );
            console.log(response);
            if (response.data.error) {
                setErrorMsg({ error: response.data.error });
                console.log(response.data.error);
            } else {
                // Close the modal after submission
                toggleModal();
                // window.location.reload();
            }
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                    <h2 className="text-2xl font-bold mb-4">Schedule Meeting</h2>
                    {errorMsg.error && (
                        <p className="text-center text-red-500 font-medium mb-4">
                            {errorMsg.error}
                        </p>
                    )}
                    <form>
                        <div className="mb-4">
                            <label className="block text-gray-700">Meeting Location:</label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                                value={meetingLocation}
                                onChange={(e) => setMeetingLocation(e.target.value)}
                                placeholder="Describe the work"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700">Meeting Description:</label>
                            <textarea
                                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                                name="remark"
                                rows="2"
                                cols="50"
                                value={meetingDescription}
                                onChange={(e) => setMeetingDescription(e.target.value)}
                                placeholder="Enter Remark of Task"
                                required
                            ></textarea>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700">Meeting Date&Time</label>
                            <DatePicker
                                selected={meetingDTime}
                                onChange={(date) => setMeetingDTime(date)}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={30}
                                dateFormat="Pp"
                                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                                placeholderText="Select Deadline"
                            />
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                onClick={handleSubmit}
                            >
                                Submit
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                onClick={toggleModal}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ScheduleMeeting;
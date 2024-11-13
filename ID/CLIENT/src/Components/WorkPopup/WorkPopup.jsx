import React, { useState, useEffect } from 'react';
import axios from "axios";

function WorkPopup({ workID, closePopup }) {
    const [token, setToken] = useState(null);
    const [workData, setWorkData] = useState({})

    let fetchWorkData = async (token) => {
        // console.log(token);

        try {
            let response = await axios.post("/api/empolyeeportal/workdata",
                { workID },
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                },
            )
            setWorkData(response.data[0])
            // console.log(response.data[0])
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        const tokenFromStorage = localStorage.getItem('token');
        setToken(tokenFromStorage);
        // console.log(workID)
        fetchWorkData(tokenFromStorage)
    }, [])

    let onClose = () => {
        closePopup(false)
    }
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white p-4 rounded-lg w-full max-w-lg border-2 border-gray-600">
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-900 h-full">
                        <i className="fas fa-times text-xl m-0"></i>
                    </button>
                    <div className="flex items-center w-full -mt-2">
                        <div key={workData.WorkID} className="bg-white rounded-lg p-5 w-full">
                            <div className="mb-3">
                                <p className="font-normal text-gray-500">Employee Work:</p>
                                <p className="text-gray-600 text-xl">{workData.EmployeeWork || "NULL"}</p>
                            </div>
                            
                            <div className="mb-3">
                                <p className="font-normal text-gray-500">Assigned By:</p>
                                <p className="text-gray-600 text-xl">{workData.AssignedBy || "NULL"}</p>
                            </div>

                            <div className="mb-3">
                                <p className="font-normal text-gray-500">Assigned On:</p>
                                <p className="text-gray-600 text-xl">{new Date(workData.AssignedDTime).toLocaleString() || "NULL"}</p>
                            </div>

                            <div>
                                <p className="font-normal text-gray-500">Deadline:</p>
                                <p className="text-gray-600 text-xl">{new Date(workData.Deadline).toLocaleString() || "NULL"}</p>
                            </div>

                            <div>
                                <p className="font-normal text-gray-500">Remarks:</p>
                                <p className="text-gray-600 text-xl">{workData.WorkRemarks || "NULL"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WorkPopup;
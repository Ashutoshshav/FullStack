import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import WorkPopup from '../../Components/WorkPopup/WorkPopup';

function AllWorks(props) {
    const [data, setData] = useState([])
    const [token, setToken] = useState(null)
    const [openWorkPopup, setOpenWorkPopup] = useState(false)
    const [workID, setWorkID] = useState(null)

    let fetchData = async (token) => {
        try {
            // console.log(token)
            let response = await axios.get("http://192.168.0.252:5000/api/work/allworks", {
                headers: {
                    Authorization: `${token}`,
                },
            })
            setData(response.data)
            // console.log(response.data)
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        const tokenFromStorage = localStorage.getItem('token');
        setToken(tokenFromStorage);
        fetchData(tokenFromStorage)
    }, [])

    let handleWorkPopup = (id) => {
        setWorkID(id)
        setOpenWorkPopup(true)
    }
    return (
        <div>
            <div className="overflow-x-auto shadow-md rounded-xl m-2">
                <table className="table-auto w-full">
                    <thead className="bg-gray-100 text-black w-full">
                        <tr className="border">
                            <th className="px-4 py-4 font-normal text-gray-500">Employee Name</th>
                            <th className="px-4 py-4 font-normal text-gray-500">Employee Work</th>
                            <th className="px-4 py-4 font-normal text-gray-500">Assigned By</th>
                            <th className="px-4 py-4 font-normal text-gray-500">Assigned On</th>
                            <th className="px-4 py-4 font-normal text-gray-500">Category</th>
                            <th className="px-4 py-4 font-normal text-gray-500">Deadline</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data && data.map((work) => (
                                    <tr key={work.WorkID} className="border text-center cursor-pointer" onClick={() => handleWorkPopup(work.WorkID)}>
                                        <td className="px-4 py-2">{work.EmployeeName}</td>
                                        <td className="px-4 py-2">{work.EmployeeWork}</td>
                                        <td className="px-4 py-2">{work.AssignedBy}</td>
                                        <td className="px-4 py-2">
                                            {new Date(work.AssignedDTime).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-2">{work.WorkCategory}</td>
                                        <td className="px-4 py-2">
                                            {new Date(work.Deadline).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                        }
                    </tbody>
                </table>
            </div>
            {
                openWorkPopup && <WorkPopup workID = {workID} closePopup = {setOpenWorkPopup} />
            }
        </div>
    );
}

export default AllWorks;
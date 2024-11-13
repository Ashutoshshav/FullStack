import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function DailyEmployeeEntry(props) {
    const [data, setData] = useState([])
    const [token, setToken] = useState(null)
    const [updateEntry, setUpdateEntry] = useState({})
    const [jobCategory, setJobCategory] = useState([]);

    let fetchAllEntry = async (token) => {
        try {
            let response = await axios.get("/api/work/daily-entry", {
                headers: {
                    Authorization: `${token}`,
                },
            });
            let data = response.data;
            // console.log(data);

            setData(data)
        } catch (err) {
            console.log(err);
        }
    };

    const handleTimeInChange = async (entryNo, type, value) => {
        console.log(token);
        
        setUpdateEntry((prev) => ({
            ...prev,
            [entryNo]: {
                ...prev[entryNo],
                [type]: value,
            },
        }));

        const updateData = {
            [entryNo]: {
                ...updateEntry[entryNo],
                [type]: value,
            },
        };

        // Send the update request to the backend
        try {
            await axios.put("/api/work/update-employee-entry", updateData, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            console.log('Entry updated successfully');
        } catch (error) {
            console.error('Error updating entry:', error);
        }
        console.log(updateData)
    };

    let getJobCategory = async (token) => {
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

    useEffect(() => {
        const tokenFromStorage = localStorage.getItem('token');
        setToken(tokenFromStorage);
        fetchAllEntry(tokenFromStorage)
        getJobCategory(tokenFromStorage)
    }, [])
    return (
        <div className=''>
            <div className="overflow-x-auto mt-2">
                <table className="min-w-full border border-gray-200">
                    <thead className="bg-gray-100 text-black">
                        <tr className="border">
                            <th className="px-4 py-4 font-normal text-gray-500">Employee ID</th>
                            <th className="px-4 py-4 font-normal text-gray-500">Employee Name</th>
                            <th className="px-4 py-4 font-normal text-gray-500">Date</th>
                            <th className="px-4 py-4 font-normal text-gray-500">Time In</th>
                            <th className="px-4 py-4 font-normal text-gray-500">Time Out</th>
                            <th className="px-4 py-4 font-normal text-gray-500">Log Status</th>
                            <th className="px-4 py-4 font-normal text-gray-500">Job Category</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data && data.map((item) => (
                            <tr className="border text-center" key={item.EntryNo}>
                                <td className="px-4 py-2">{item.EmployeeID}</td>
                                <td className="px-4 py-2">{item.EmployeeName}</td>
                                <td className="px-4 py-2">{moment(item.Date).format("Do, MMM, YYYY")}</td>
                                <td className="px-4 py-2 min-w-fit">
                                    <DatePicker
                                        selected={updateEntry[item.EntryNo]?.timeIn || (item.TimeIn ? moment(item.TimeIn).toDate() : null)}
                                        onChange={(time) => handleTimeInChange(item.EntryNo, "timeIn", time)}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeFormat="HH:mm"
                                        timeIntervals={1}
                                        dateFormat="HH:mm:ss aa"
                                        className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                                        placeholderText="Not Available"
                                    />
                                </td>
                                <td className="px-4 py-2">
                                    <DatePicker
                                        selected={updateEntry[item.EntryNo]?.timeOut || (item.TimeOut ? moment(item.TimeOut).toDate() : null)}
                                        onChange={(time) => handleTimeInChange(item.EntryNo, "timeOut", time)}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeFormat="HH:mm"
                                        timeIntervals={1}
                                        dateFormat="HH:mm:ss aa"
                                        className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                                        placeholderText="Not Available"
                                    />
                                </td>
                                <td className="px-4 py-2">{item.LoggedStatus ? item.LoggedStatus : "NULL"}</td>
                                <td className="px-4 py-2">
                                    <div className="">
                                        <select
                                            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                                            name=""
                                            id=""
                                            onChange={(e) => handleTimeInChange(item.EntryNo, "jobCategory", e.target.value)}
                                        >
                                            <option
                                                value=""
                                                className="w-full text-center border border-gray-300 rounded px-3 py-2 mt-1"
                                            >
                                                {item.JobCategory}
                                            </option>
                                            {jobCategory &&
                                                jobCategory.map((job, index = 1) => (
                                                    <option
                                                        value={job.JobCateroryNo}
                                                        key={index++}
                                                    >
                                                        {job.JobCategoryName}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DailyEmployeeEntry;
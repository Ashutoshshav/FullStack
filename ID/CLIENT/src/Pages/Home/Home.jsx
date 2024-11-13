import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import moment from "moment";
import AssignWorkMe from "../../Components/AssignWorkMe/AssignWorkMe";
import ScheduleMeeting from "../../Components/ScheduleMeeting/ScheduleMeeting";

function Home(props) {
  let token = localStorage.getItem("token");
  const navigate = useNavigate();
  let [workData, setWorkData] = useState([]);
  let [meetingData, setMeetingData] = useState([]);
  const [urgentTasks, setUrgentTasks] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [inactiveTasks, setInactiveTasks] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [openScheduleMeeting, setOpenScheduleMeeting] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const [nDay, setNDay] = useState(7);

  let fetchData = async () => {
    // console.log(token)
    try {
      let response = await axios.get(
        "/api/empolyeeportal/allwork",
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      // console.log("Response data structure:", response.data);

      if (Array.isArray(response.data)) {
        setWorkData(response.data);
        categorizeTasks(response.data);
      } else {
        console.error("Unexpected data structure:", response.data);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  let fetchMeetingData = async () => {
    try {
      let response = await axios.get(
        "/api/meeting/employeemeeting",
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      // console.log(response.data);
      setMeetingData(response.data)
    } catch (err) {
      console.log(err);
    }
  }

  let fetchAvailableMeetingSchedule = async (nDay) => {
    try {
      let response = await axios.post("/api/meeting/freemeetschedule", { nDay },
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      )

      // console.log(response);
      setSchedule(response.data)
    } catch (err) {
      console.log(err);
    }
  }

  const categorizeTasks = (tasks) => {
    // console.log(tasks);

    const urgent = [];
    const pending = [];
    const inactive = [];

    tasks.forEach((task) => {
      switch (
      task.WorkCategory // assuming WorkCategory holds the correct category number
      ) {
        case 1: // Urgent & Important
          urgent.push(task);
          break;
        case 2: // Pending
          pending.push(task);
          break;
        case 3: // Inactive
          inactive.push(task);
          break;
        default:
          break;
      }
    });

    setUrgentTasks(urgent);
    setPendingTasks(pending);
    setInactiveTasks(inactive);
  };

  useEffect(() => {
    if(!token) {
      navigate("/Login")
    }
    fetchData();
    fetchMeetingData()
    fetchAvailableMeetingSchedule(nDay)
  }, [openPopup, openScheduleMeeting]);

  const handleAssignPopup = () => {
    setOpenPopup(true);
  };

  const handleScheduleMeeting = () => {
    setOpenScheduleMeeting(true);
  };

  const handleSetNDay = (n) => {
    setNDay(n)
    fetchAvailableMeetingSchedule(n)
  }

  const availableSlots = schedule.filter(item =>
    item.FirstHalfStatus === 'Available' || item.SecondHalfStatus === 'Available'
  );

  let handleWorkStart = async (workID) => {
    try {
      let response = await axios.post("/api/empolyeeportal/startwork", {workID}, {
        headers: {
          Authorization: `${token}`,
        },
      },)
      
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="w-full">
      <div>
        <div className="w-full flex justify-between py-1 text-lg bg-gray-200 pl-3 font-semibold" style={{ border: "1px solid #31708F" }}>
          <h1
            className=""
          >
            My Tasks
          </h1>
          <button className="mr-3 hover:text-gray-500" onClick={handleAssignPopup}>Add Task + </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {/* Urgent & Important Tasks */}
          {urgentTasks.length > 0 ? (
            <div className="task-category urgent-tasks border-2 border-gray-500">
              <div className="">
                <div
                  className="text-white flex items-center justify-between p-1 bg-customBlue"
                >
                  <div className="ml-1">
                    <h2 className="text-xl">Urgent & Important Task</h2>
                    <p>Today's Activity Plan</p>
                  </div>
                  <p className="mr-3 text-2xl">{1}</p>
                </div>

                <div className="max-h-40 overflow-y-auto">
                  <table className="w-full table-fixed">
                    <thead className="w-full text-left sticky top-0 bg-white">
                      <tr className="">
                        <th className="w-4/10 pl-2">Name of Task</th>
                        <th className="w-6/10 pl-2">Compleation Target</th>
                      </tr>
                    </thead>
                    <tbody>
                      {urgentTasks.map((task) => (
                        <tr className="cursor-pointer" key={task.WorkID} onClick={() => handleWorkStart(task.WorkID)}>
                          <td className="text-left pl-2">{task.WorkName}</td>
                          <td className="text-left pl-2">
                            {moment(task.Deadline).format("Do, MMM, YYYY, HH:mm:ss A")}
                            {/* {new Date(task.Deadline).toLocaleString()} */}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}

          {/* Pending Tasks */}
          {pendingTasks.length > 0 ? (
            <div className="task-category urgent-tasks border-2 border-gray-500">
              <div className="">
                <div
                  className="text-white bg-customBlue flex items-center justify-between p-1"
                >
                  <div className="ml-1">
                    <h2 className="text-xl">Pending Task</h2>
                    <p>Important but not Urgent</p>
                  </div>
                  <p className="mr-3 text-2xl">{2}</p>
                </div>

                <table className="w-full">
                  <thead className="w-full text-left">
                    <tr className="">
                      <th className="w-1/2 pl-2">Name of Task</th>
                      <th className="w-1/2 pl-2">Compleation Target</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingTasks.map((task) => (
                      <tr className="cursor-pointer" key={task.WorkID} onClick={() => handleWorkStart(task.WorkID)}>
                        <td className="text-left pl-2">{task.WorkName}</td>
                        <td className="text-left pl-2">
                          {moment(task.Deadline).format("Do, MMM, YYYY, HH:mm:ss A")}
                          {/* {new Date(task.Deadline).toLocaleString()} */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            ""
          )}

          {/* Inactive Tasks */}
          {inactiveTasks.length > 0 ? (
            <div className="task-category urgent-tasks border-2 border-gray-500">
              <div className="">
                <div
                  className="text-white flex bg-customBlue items-center justify-between p-1"
                >
                  <div className="ml-1">
                    <h2 className="text-xl">Inactive Task</h2>
                    <p>Not Urgent, Not Important</p>
                  </div>
                  <p className="mr-3 text-2xl">{3}</p>
                </div>

                <table className="w-full">
                  <thead className="w-full text-left">
                    <tr className="">
                      <th className="w-1/2 pl-2">Name of Task</th>
                      <th className="w-1/2 pl-2">Compleation Target</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inactiveTasks.map((task) => (
                      <tr className="cursor-pointer" key={task.WorkID} onClick={() => handleWorkStart(task.WorkID)}>
                        <td className="text-left pl-2">{task.WorkName}</td>
                        <td className="text-left pl-2">
                          {moment(task.Deadline).format("Do, MMM, YYYY, HH:mm:ss A")}
                          {/* {new Date(task.Deadline).toLocaleString()} */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <div>
        <div className="w-full flex justify-between py-1 text-lg bg-gray-200 pl-3 font-semibold" style={{ border: "1px solid #31708F" }}>
          <h1
            className="mr-3"
          >
            My Meetings
          </h1>
          <button className="mr-3 hover:text-gray-500" onClick={handleScheduleMeeting}>Schedule Meeting + </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 p-4">

          <div className="task-category urgent-tasks border-2 border-gray-500">
            {meetingData.length > 0 ? (
              <div className="">
                <div
                  className="text-white flex items-center justify-between p-1"
                  style={{ backgroundColor: "#31708F" }}
                >
                  <div className="ml-1">
                    <h2 className="text-xl">Meeting Schedule Booked</h2>
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto">
                  <table className="w-full table-fixed">
                    <thead className="sticky top-0 bg-white w-full text-left">
                      <tr className="">
                        <th className="w-1/3 pl-2">Date & Time</th>
                        <th className="w-1/3 pl-2">Location</th>
                        <th className="w-1/3 pl-2">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {meetingData.map((task) => (
                        <tr key={task.MeetingID}>
                          <td className="text-left pl-2">
                            {moment(task.MeetingDTime).format("Do, MMM, YYYY, HH:mm:ss A")}
                            {/* {new Date(task.MeetingDTime).toLocaleString()} */}
                          </td>
                          <td className="text-left pl-2">{task.MeetingLocation}</td>
                          <td className="text-left pl-2">{task.MeetingDescription}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p>No Urgent Tasks</p>
            )}
          </div>

          <div className="task-category urgent-tasks border-2 border-gray-500">
            {meetingData.length > 0 ? (
              <div className="">
                <div
                  className="text-white p-1"
                  style={{ backgroundColor: "#31708F" }}
                >
                  <div className="ml-1 flex items-center justify-between">
                    <h2 className="text-xl">Available Schedule</h2>
                    <div className="">
                      <button className="mr-3 px-2 py-1 rounded bg-white text-black hover:text-gray-500 text-base font-semibold" onClick={() => handleSetNDay(7)}>7 Days</button>
                      <button className="mr-3 px-2 py-1 rounded bg-white text-black hover:text-gray-500 text-base font-semibold" onClick={() => handleSetNDay(15)}>15 Days</button>
                      <button className="mr-3 px-2 py-1 rounded bg-white text-black hover:text-gray-500 text-base font-semibold" onClick={() => handleSetNDay(30)}>30 Days</button>
                    </div>
                  </div>
                </div>

                {availableSlots.length > 0 ? (
                  <div className="max-h-64 overflow-y-auto">
                    <table className="w-full table-fixed">
                      <thead className="sticky top-0 bg-white w-full text-left">
                        <tr>
                          <th className="w-1/2 pl-2">Date</th>
                          <th className="w-1/2 pl-2">Available Slot</th>
                        </tr>
                      </thead>
                      <tbody className="">
                        {availableSlots.map((item) => (
                          <tr key={item.MeetingDate}>
                            <td className="text-left pl-2">
                              {moment(item.MeetingDate).format("Do, MMM, YYYY")}
                              {/* {new Date(item.MeetingDate).toLocaleDateString('en-GB')} */}
                            </td>
                            <td className="text-left pl-2">
                              {item.FirstHalfStatus === 'Available'
                                ? 'First Half Available'
                                : 'Second Half Available'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>No available meeting slots found.</p>
                )}
              </div>
            ) : (
              <p>No Urgent Tasks</p>
            )}
          </div>
        </div>
      </div>
      {openPopup && <AssignWorkMe closePopup={setOpenPopup} />}
      {openScheduleMeeting && <ScheduleMeeting closePopup={setOpenScheduleMeeting} />}
    </div>
  );
}

export default Home;

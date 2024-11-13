import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

const AssignWorkPopup = ({ closePopup }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [empID, setEmpID] = useState("");
  const [empWork, setEmpWork] = useState("");
  const [workName, setWorkName] = useState("");
  const [workCat, setWorkCat] = useState("");
  const [remark, setRemark] = useState("");
  const [deadline, setDeadline] = useState(null);
  const [token, setToken] = useState(null);
  const [allEmployee, setAllEmployee] = useState([]);
  const [errorMsg, setErrorMsg] = useState({
    error: "",
    success: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
    if (token) {
      handleGetAllEmployee(token);
    }
  }, [])

  const toggleModal = () => {
    closePopup(false);
  };

  let handleGetAllEmployee = async (token) => {
    try {
      let response = await axios.get(
        "/api/empolyeeportal/allemployee",
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      setAllEmployee(response.data);
      // console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async () => {
    try {
      const assignedWork = { empID, workName, empWork, workCat, deadline, remark };
      let response = await axios.post(
        "/api/work/assigning",
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
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-4">Assign Work</h2>
          {errorMsg.error && (
            <p className="text-center text-red-500 font-medium mb-4">
              {errorMsg.error}
            </p>
          )}
          <form>
            <div className="mb-4">
              <label htmlFor="empID">Select Employee</label>
              <select className="w-full border border-gray-300 rounded px-3 py-2 mt-1" id="empID" name="" value={empID} onChange={(e) => setEmpID(e.target.value)}>
                <option value="">Select Employee</option>
                {
                  allEmployee &&
                  allEmployee.map((employee) => (
                    <option key={employee.EmployeeID} value={employee.EmployeeID}>{employee.EmployeeName}</option>
                  ))
                }
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="workName">Work Name:</label>
              <input
                type="text"
                id="workName"
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                value={workName}
                onChange={(e) => setWorkName(e.target.value)}
                placeholder="Enter Work Name"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="empWork">Employee Work:</label>
              <input
                type="text"
                id="empWork"
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                value={empWork}
                onChange={(e) => setEmpWork(e.target.value)}
                placeholder="Describe the work"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="taskSelect">Work Category:</label>
              <select id="taskSelect" className="w-full border border-gray-300 rounded px-3 py-2 mt-1" value={workCat} onChange={(e) => setWorkCat(e.target.value)}>
                <option className="w-full border border-gray-300 rounded px-3 py-2 mt-1">--Select Work Category--</option>
                <option className="w-full border border-gray-300 rounded px-3 py-2 mt-1" value={1}>Urgent & Important Task</option>
                <option className="w-full border border-gray-300 rounded px-3 py-2 mt-1" value={2}>Pending Task</option>
                <option className="w-full border border-gray-300 rounded px-3 py-2 mt-1" value={3}>Inactive Task</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Work Remarks:</label>
              <textarea
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                name="remark"
                rows="2"
                cols="50"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Enter Remark of Task"
                required
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Deadline:</label>
              <DatePicker
                selected={deadline}
                onChange={(date) => setDeadline(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={30}
                dateFormat="Pp"
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                placeholderText="Select Deadline"
                minDate={new Date()}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 bg-customBlue text-white rounded hover:bg-customBlue2"
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
};

export default AssignWorkPopup;

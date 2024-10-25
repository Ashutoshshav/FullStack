import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

const AssignWorkMe = ({ closePopup }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [empWork, setEmpWork] = useState("");
  const [workName, setWorkName] = useState("");
  const [workCat, setWorkCat] = useState("");
  const [remark, setRemark] = useState("");
  const [deadline, setDeadline] = useState(null);
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
      const assignedWork = { workName, empWork, workCat, deadline, remark };
      let response = await axios.post(
        "http://192.168.0.252:5000/api/empolyeeportal/assignwork",
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
              <label className="block text-gray-700">Work Name:</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                value={workName}
                onChange={(e) => setWorkName(e.target.value)}
                placeholder="Describe the work"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="taskSelect">Work Category:</label>
              <select id="taskSelect" className="w-full border border-gray-300 rounded px-3 py-2 mt-1" value={workCat} onChange={(e) => setWorkCat(e.target.value)}>
                <option className="w-full border border-gray-300 rounded px-3 py-2 mt-1">--Select an option--</option>
                <option className="w-full border border-gray-300 rounded px-3 py-2 mt-1" value={1}>Urgent & Important Task</option>
                <option className="w-full border border-gray-300 rounded px-3 py-2 mt-1" value={2}>Important Task</option>
                <option className="w-full border border-gray-300 rounded px-3 py-2 mt-1" value={3}>Inactive Task</option>
              </select>
            </div>

            {/* <div className="mb-4">
              <label className="block text-gray-700">Work Category:</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                value={workCat}
                onChange={(e) => setWorkCat(e.target.value)}
                placeholder="Enter Work Category"
                required
              />
            </div> */}

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
};

export default AssignWorkMe;

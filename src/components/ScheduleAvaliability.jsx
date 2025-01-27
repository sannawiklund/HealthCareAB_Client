import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ScheduleAvailability() {
  const {
    authState: { user },
  } = useAuth();
  const navigate = useNavigate();

  const [selectedDates, setSelectedDates] = useState([]);
  const [currentDate, setCurrentDate] = useState("");

  const handleAddDate = () => {
    if (currentDate) {
      setSelectedDates((prevDates) => [...prevDates, new Date(currentDate)]);
      setCurrentDate("");
    }
  };

  const handleRemoveDate = (index) => {
    setSelectedDates((prevDates) => prevDates.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      const caregiverId = user; // Assumes the `user` contains the caregiver's ID
      const response = await axios.post(`http://localhost:5148//availability/${user}`, {
        caregiverId,
        availableSlots: selectedDates.map((date) => date.toISOString()),
      });
  
      if (response.status === 201) {
        alert("Availability successfully added!");
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.error("Error response:", error.response);
      alert("Failed to add availability. Please try again.");
    }
  };  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-semibold mb-4">Schedule Availability</h2>
      <div className="flex items-center mb-4">
        <input
          type="datetime-local"
          value={currentDate}
          onChange={(e) => setCurrentDate(e.target.value)}
          className="border px-3 py-2 rounded mr-2"
        />
        <button
          onClick={handleAddDate}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Date
        </button>
      </div>
      <ul className="mb-4">
        {selectedDates.map((date, index) => (
          <li key={index} className="flex items-center mb-2">
            <span className="mr-4">{new Date(date).toLocaleString()}</span>
            <button
              onClick={() => handleRemoveDate(index)}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={handleSubmit}
        className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Save Availability
      </button>
    </div>
  );
}

export default ScheduleAvailability;

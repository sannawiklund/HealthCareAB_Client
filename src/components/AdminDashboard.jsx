import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/health_care_logo.svg";
import Logout from "./Logout";
import axios from "axios";

function AdminDashboard() {
  const { authState } = useAuth();
  const { user, userId } = authState; // Extrahera både user och userId
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch available slots
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      const token = localStorage.getItem("authToken");

      try {
        const response = await axios.get(
          `http://localhost:5148/slots/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true, // Viktigt för att cookies skickas med
          }
        );

        const timeNow = new Date(); // Hämtar aktuell tid

        const availableSlots = response.data
          .map((slot) => {
            const dateObj = new Date(slot);
            return {
              date: dateObj,
              formattedDate: dateObj.toLocaleDateString(),
              startTime: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
          })
          .filter(slot => slot.date > timeNow) // Filtrerar bort passerade tider
          .sort((a, b) => a.date - b.date); // Sorterar tiderna i kronologisk ordning
        setSlots(availableSlots);
      } catch (error) {
        setError(error.response ? error.response.data : "Error fetching available slots");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchAvailableSlots();
    }
  }, [userId]);

  return (
    <div className="relative min-h-screen p-10 bg-white">
      <div className="absolute top-4 right-4">
        <Logout />
      </div>

      <div className="flex flex-col items-center">
        <img src={Logo} alt="Logo" className="h-80" />
        <h1 className="text-xl font-semibold mt-4 text-gray-800">
          Welcome, {user}!
        </h1>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6 sm:border-none">
        <button onClick={() => navigate("/scheduleavaliability")} className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg sm:border-0">
          <div className="w-10 h-10 bg-[#06B6D4] text-white flex items-center justify-center rounded-md mb-2">
            <span className="material-symbols-outlined text-white text-2xl">event</span>
          </div>
          <span className="text-sm font-medium text-gray-800">Schedule Availability</span>
        </button>

        <button onClick={() => navigate("/feedback")} className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg sm:border-0">
          <div className="w-10 h-10 bg-[#06B6D4] text-white flex items-center justify-center rounded-md mb-2">
            <span className="material-symbols-outlined text-white text-2xl">bar_chart</span>
          </div>
          <span className="text-sm font-medium text-gray-800">View Feedback</span>
        </button>

        <button onClick={() => navigate("/userpage")} className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg sm:border-0">
          <div className="w-10 h-10 bg-[#06B6D4] text-white flex items-center justify-center rounded-md mb-2">
            <span className="material-symbols-outlined text-white">group</span>
          </div>
          <span className="text-sm font-medium text-gray-800">Profile</span>
        </button>
      </div>

      {/* Main Content Section */}
      <div className="mt-8 space-y-8">
        {/* Available Slots Section */}
        <div className="w-full max-w-xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
            Your availability
          </h2>

          {/* List of Available Slots */}
          {slots.length > 0 ? (
            <ul>
              {slots.map((slot, index) => (
                <li
                  key={index}
                  className="p-4 rounded-lg shadow-sm mb-4 border bg-[#E0F7FA] border-[#06B6D4]"
                >
                  <p className="text-lg font-medium text-black">Slot</p>
                  <p className="text-sm text-gray-500">Time: {slot.startTime}</p>
                  <p className="text-sm text-gray-500">Date: {slot.formattedDate}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No available slots found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

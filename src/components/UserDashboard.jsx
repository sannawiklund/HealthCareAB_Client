import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom"; // Importera useNavigate
import Logo from "../assets/health_care_logo.svg";
import Logout from "./Logout";
import axios from "axios";
import React from "react";
import Booking from "./Booking";

function UserDashboard() {
  // using custom hook to check if the user i authenticated and has the correct role
  const { authState } = useAuth();
  const { user } = authState;
  const userId = authState.userId;
  const navigate = useNavigate(); // Skapa navigate-instans
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [error, setError] = useState(null);

  // Fetch upcoming appointments
  useEffect(() => {

    const fetchUpcomingAppointments = async () => {

      try {
        const response = await axios.get(
          `http://localhost:5148/upcoming/${userId}`,

          {
            withCredentials: true 
          }
        );

        const upcoming = await response.data;
        // Det går endast att köra en sort om det finns mer än ett element i listan, detta kontrollerades inte innan
        if (upcoming.length > 1) {
          upcoming.sort((a, b) => new Date(a.appointmentTime) - new Date(b.appointmentTime));
        }
        setUpcomingAppointments(upcoming);
      } catch (error) {
        setError(error.response ? error.response.data : "Error fetching upcoming appointments");
      }
    };

    if (userId) {
      fetchUpcomingAppointments();
    }
  }, [userId]);

  // Fetch appointment history
  useEffect(() => {
    const fetchAppointmentHistory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5148/history/${userId}`,

          {
            withCredentials: true 
          }

        );
        const history = await response.data;
        if (history.length > 1) {
          history.sort((a, b) => new Date(a.appointmentTime) - new Date(b.appointmentTime));
        }
        setAppointmentHistory(history);
      } catch (error) {
        setError(error.response ? error.response.data : "Error fetching appointment history");
      }
    };

    if (userId) {
      fetchAppointmentHistory();
    }
  }, [userId]);

  if (error) {
    return <div>Error: {error}</div>;
  }


  return (
    <>
      <div className="relative min-h-screen p-10 bg-white">
        {/* Logga ut-knapp längst upp till höger */}
        <div className="absolute top-4 right-4">
        </div>
        <Logout />

        {/* Header Section */}
        <div className="flex flex-col items-center">
          <img src={Logo} alt="Logo" className="h-80" />
          <h1 className="text-xl font-semibold mt-4 text-gray-800">
            Welcome, {user}!
          </h1>
        </div>

        {/* Navigation Section */}
        <div className="grid grid-cols-3 gap-4 mb-6 sm:border-none">
          <button
            onClick={() => navigate("/booking")}
            className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg sm:border-0"
          >
            <div className="w-10 h-10 bg-[#06B6D4] text-white flex items-center justify-center rounded-md mb-2">
              {/* Calendar icon from Material Symbols */}
              <span className="material-symbols-outlined text-white">calendar_month</span>
            </div>
            <span className="text-sm font-medium text-gray-800">Book an appointment</span>
          </button>

          <button
            onClick={() => navigate("/feedback")}
            className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg sm:border-0"
          >
            <div className="w-10 h-10 bg-[#06B6D4] text-white flex items-center justify-center rounded-md mb-2">
              {/* Material Symbols Forum Icon */}
              <span className="material-symbols-outlined text-white text-2xl">forum</span>
            </div>
            <span className="text-sm font-medium text-gray-800">Leave Feedback</span>
          </button>

          <button
            onClick={() => navigate("/userpage")}
            className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg sm:border-0"
          >
            <div className="w-10 h-10 bg-[#06B6D4] text-white flex items-center justify-center rounded-md mb-2">
              {/* Material Symbols Person Icon */}
              <span className="material-symbols-outlined text-white text-2xl">person</span>
            </div>
            <span className="text-sm font-medium text-gray-800">View Profile</span>
          </button>
        </div>


        {/* Main Content Section */}
        <div className="mt-8 space-y-8">
          {/* Appointments Section */}
          <div className="w-full max-w-xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
              Appointments
            </h2>

            {/* Combined List for Upcoming and Past Appointments */}
            {upcomingAppointments.length > 0 || appointmentHistory.length > 0 ? (
              <ul>
                {/* Upcoming Appointments */}
                {upcomingAppointments.length > 0 && (
                  <>
                    {upcomingAppointments.map((appointment, index) => (
                      <li
                        key={index}
                        className={`p-4 rounded-lg shadow-sm mb-4 border ${appointment.status === "Scheduled"
                          ? "bg-[#E0F7FA] border-[#06B6D4]" // Blå färg för Scheduled
                          : "bg-gray-100 border-gray-300"  // Samma bakgrund för Cancelled och andra statusar
                          }`}
                      >
                        <p className={`text-lg font-medium ${appointment.status === "Cancelled" ? "text-lg font-medium text-gray-500" : "text-black"}`}>
                          {appointment.status}
                        </p>
                        <p className="text-sm text-gray-600">
                          Caregiver: {appointment.caregiverName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Time: {new Date(appointment.appointmentTime)
                            .toLocaleString(undefined, {
                              hour: "2-digit",
                              minute: "2-digit",
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            })
                            .replace(", ", " ")
                            .replace(/\//g, "-")}
                        </p>
                      </li>
                    ))}
                  </>
                )}


                {/* Past Appointments */}
                {appointmentHistory.length > 0 && (
                  <>
                    {appointmentHistory.map((appointment, index) => (
                      <li
                        key={index}
                        className={`p-4 rounded-lg shadow-sm mb-4 border ${"bg-gray-100 border-gray-300"  // Alltid ljusgrå bakgrund
                          }`}
                      >
                        <p className="text-lg font-medium text-gray-500">
                          {appointment.status}
                        </p>
                        <p className="text-sm text-gray-600">
                          Caregiver: {appointment.caregiverName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Time: {new Date(appointment.appointmentTime)
                            .toLocaleString(undefined, {
                              hour: "2-digit",
                              minute: "2-digit",
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            })
                            .replace(", ", " ")
                            .replace(/\//g, "-")}
                        </p>
                      </li>
                    ))}
                  </>
                )}
              </ul>
            ) : (
              <p>No appointments found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );

}

export default UserDashboard;


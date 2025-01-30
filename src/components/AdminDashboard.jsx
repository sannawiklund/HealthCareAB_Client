import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/health_care_logo.svg";
import Logout from "./Logout";
import axios from "axios";

function AdminDashboard() {
  const { authState } = useAuth();
  const { user, userId } = authState;
  const [slots, setSlots] = useState([]);
  const [appointments, setAppointments] = useState([]); // Nytt state för appointments
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isShowingAppointments, setIsShowingAppointments] = useState(true); // Toggle för att byta vy
  const navigate = useNavigate();

  // Hämta tillgängliga tider
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      const token = localStorage.getItem("authToken");

      try {
        const response = await axios.get(
          `http://localhost:5148/slots/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        const timeNow = new Date();
        const availableSlots = response.data
          .map((slot) => {
            const dateObj = new Date(slot);
            return {
              date: dateObj,
              formattedDate: dateObj.toLocaleDateString(),
              startTime: dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            };
          })
          .filter(slot => slot.date > timeNow)
          .sort((a, b) => a.date - b.date);

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


  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem("authToken");

      try {
        const response = await axios.get(
          `http://localhost:5148/admin/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        const fetchedAppointments = response.data.map((appointment) => {
          return {
            date: new Date(appointment.appointmentTime).toLocaleDateString(),
            startTime: new Date(appointment.appointmentTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            patientName: appointment.patientName,
            status: appointment.status,
            appointmentTime: new Date(appointment.appointmentTime), // Lägg till appointmentTime för sortering
          };
        }).sort((b, a) => b.appointmentTime - a.appointmentTime);

        setAppointments(fetchedAppointments);
      } catch (error) {
        setError(error.response ? error.response.data : "Error fetching appointments");
      }
    };

    if (userId) {
      fetchAppointments();
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

      {/* Huvudinnehåll */}
      <div className="mt-8 space-y-8">
        {/* Växlingsknapp och rubrik */}
        <div className="w-full max-w-xl mx-auto flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
            {isShowingAppointments ? "Your Appointments" : "Your Availability"}
          </h2>
          <label className="flex items-center cursor-pointer">
            <span className="mr-2 text-gray-600"></span>
            <input
              type="checkbox"
              className="hidden"
              checked={isShowingAppointments}
              onChange={() => setIsShowingAppointments(!isShowingAppointments)}
            />
            <div className="w-10 h-5 bg-gray-300 rounded-full relative">
              <div className={`w-5 h-5 bg-[#06B6D4] rounded-full absolute transition-transform ${isShowingAppointments ? "translate-x-5" : "translate-x-0"}`}></div>
            </div>
          </label>
        </div>

        <div className="w-full max-w-xl mx-auto">
          {isShowingAppointments ? (
            appointments.length > 0 ? (
              <div>
                {/* Scheduled section */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Scheduled</h3>
                  <ul>
                    {appointments.filter(appointment => appointment.status === "Scheduled").map((appointment, index) => (
                      <li
                        key={index}
                        className={`p-4 rounded-lg shadow-sm mb-4 border ${appointment.status === "Scheduled"
                          ? "bg-[#E0F7FA] border-[#06B6D4]"  // Blå färg för Scheduled
                          : "bg-gray-100 border-gray-300"  // Samma bakgrund för Cancelled och andra statusar
                          }`}
                      >
                        <p className={`text-lg font-medium ${appointment.status === "Completed" || appointment.status === "Cancelled" ? "text-gray-500" : "text-black"}`}>
                          {appointment.status}
                        </p>
                        <p className="text-sm text-gray-600">
                          Patient: {appointment.patientName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Time: {appointment.startTime} {appointment.date}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Previous section (Cancelled or Completed) */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Previous</h3>
                  <ul>
                    {appointments.filter(appointment => appointment.status === "Cancelled" || appointment.status === "Completed").map((appointment, index) => (
                      <li
                        key={index}
                        className={`p-4 rounded-lg shadow-sm mb-4 border ${appointment.status === "Scheduled"
                          ? "bg-[#E0F7FA] border-[#06B6D4]"  // Blå färg för Scheduled
                          : "bg-gray-100 border-gray-300"  // Samma bakgrund för Cancelled och andra statusar
                          }`}
                      >
                        <p className={`text-lg font-medium ${appointment.status === "Completed" || appointment.status === "Cancelled" ? "text-gray-500" : "text-black"}`}>
                          {appointment.status}
                        </p>
                        <p className="text-sm text-gray-600">
                          Patient: {appointment.patientName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Time: {appointment.startTime} {appointment.date}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p>No appointments found.</p>
            )
          ) : (
            slots.length > 0 ? (
              <ul>
                {slots.map((slot, index) => (
                  <li key={index} className="p-4 rounded-lg shadow-sm mb-4 border bg-[#E0F7FA] border-[#06B6D4]">
                    <p className="text-lg font-medium text-black">Slot</p>
                    <p className="text-sm text-gray-500">Time: {slot.startTime}</p>
                    <p className="text-sm text-gray-500">Date: {slot.formattedDate}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No available slots found.</p>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
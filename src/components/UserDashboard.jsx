import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom"; // Importera useNavigate
import Logo from "../assets/health_care_logo.svg";
import Logout from "./Logout";
import axios from "axios";

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
      const token = localStorage.getItem('authToken');

      try {
        const response = await axios.get(
          `http://localhost:5148/upcoming/${userId}`,

          {
            withCredentials: true // Viktigt för att cookies skickas med
          }
        );

        const upcoming = await response.data;
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
            withCredentials: true // Viktigt för att cookies skickas med
          }

        );
        const history = await response.data;
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
      <div className="relative min-h-screen p-10 bg-gray-100">
        {/* Logga ut-knapp längst upp till höger */}
        <div className="absolute top-4 right-4">
          <Logout />
        </div>

        {/* Header Section */}
        <div className="flex flex-col items-center">
          <img src={Logo} alt="Logo" className="h-80" />
          <h1 className="text-lg">Welcome, {user}!</h1>
        </div>

        {/* Button Row Section */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => navigate("/book")} // Navigera till /book
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Book
          </button>
          <button
            onClick={() => navigate("/feedback")} // Navigera till /feeback
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Feedback
          </button>
          <button
            onClick={() => navigate("/userpage")} // Navigera till /userpage
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Profile
          </button>
        </div>

        {/* Main Content Section */}
        <div className="mt-8 space-y-8">
          {/* Appointments Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Appointments</h2>

            {/* Combined List for Upcoming and Past Appointments */}
            {upcomingAppointments.length > 0 || appointmentHistory.length > 0 ? (
              <ul>
                {/* Upcoming Appointments */}
                {upcomingAppointments.length > 0 && (
                  <>
                    {upcomingAppointments.map((appointment, index) => (
                      <li key={index} className="p-4 border-b border-gray-300">
                        <p className="text-xl font-semibold py-2">{appointment.status}</p> {/* Padding endast på top/bottom */}
                        <p>Caregiver ID: {appointment.caregiverId}</p>
                        <p>Time: {new Date(appointment.appointmentTime).toLocaleString()}</p>
                      </li>
                    ))}
                  </>
                )}

                {/* Past Appointments */}
                {appointmentHistory.length > 0 && (
                  <>
                    {appointmentHistory.map((appointment, index) => (
                      <li key={index} className="p-4 border-b border-gray-300">
                        <p className="text-xl font-semibold py-2">{appointment.status}</p> {/* Padding endast på top/bottom */}
                        <p>Caregiver ID: {appointment.caregiverId}</p>
                        <p>Time: {new Date(appointment.appointmentTime).toLocaleString()}</p>
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

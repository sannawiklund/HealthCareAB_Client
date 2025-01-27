import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import Logo from "../assets/health_care_logo.svg";
import Logout from "./Logout";
import axios from "axios";

function UserDashboard() {
  // using custom hook to check if the user i authenticated and has the correct role
  const { authState } = useAuth();
  const { user } = authState;
  const userId = authState.userId;

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
    
      <div className="justify-center p-10">
        <div className="flex flex-col items-center">
          <img src={Logo} alt="Logo" className="h-80" />
          <h1 className="text-lg">Welcome, {user}!</h1>
          <Logout />
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Upcoming Appointments</h2>
          {upcomingAppointments.length > 0 ? (
            <ul>
              {upcomingAppointments.map((appointment, index) => (
                <li key={index} className="p-4 border-b border-gray-300">
                  <p>Caregiver ID: {appointment.caregiverId}</p>
                  <p>Time: {new Date(appointment.appointmentTime).toLocaleString()}</p>
                  <p>Status: {appointment.status}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No upcoming appointments found.</p>
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Appointment History</h2>
          {appointmentHistory.length > 0 ? (
            <ul>
              {appointmentHistory.map((appointment, index) => (
                <li key={index} className="p-4 border-b border-gray-300">
                  <p>Caregiver ID: {appointment.caregiverId}</p>
                  <p>Time: {new Date(appointment.appointmentTime).toLocaleString()}</p>
                  <p>Status: {appointment.status}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>You have no past appointments.</p>
          )}
        </div>
      </div>
    </>

  );
}

export default UserDashboard;

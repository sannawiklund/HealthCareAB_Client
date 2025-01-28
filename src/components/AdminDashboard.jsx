import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/health_care_logo.svg";
import Logout from "./Logout";
import ScheduleAvailability from "./scheduleAvaliability";

// admin page, can only visit if you have role ADMIN
function AdminDashboard() {
  const {
    authState: { user },
  } = useAuth();
  const [users, setUsers] = useState([]);
  const navigate = useNavigate(); 

  const handleNavigateToSchedule = () => {
    navigate("/scheduleavaliability"); 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <img src={Logo} alt="Logo" className="h-80" />
      <h2 className="text-2xl font-semibold mt-6">Admin Dashboard</h2>
      <p className="text-lg mt-2">Welcome, {user}!</p>
      
      <button
        onClick={handleNavigateToSchedule}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go to Schedule Availability
      </button>
      <Logout />
    </div>
  );
}

export default AdminDashboard;

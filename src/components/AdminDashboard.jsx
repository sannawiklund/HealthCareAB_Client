import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Logo from "../assets/health_care_logo.svg";
import Logout from "./Logout";

// admin page, can only visit if you have role ADMIN

function AdminDashboard() {
  const {
    authState: { user },
  } = useAuth();
  const [users, setUsers] = useState([]);

  return (

    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <img src={Logo} alt="Logo" className="h-80" />
      <h2 className="text-2xl font-semibold mt-6">Admin Dashboard</h2>
      <p className="text-lg mt-2">Welcome, {user}!</p>
      <Logout />
    </div>

  );
}

export default AdminDashboard;

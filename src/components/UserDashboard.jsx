import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Logo from "../assets/health_care_logo.svg";
import Logout from "./Logout";

function UserDashboard() {
  // using custom hook to check if the user i authenticated and has the correct role
  const {
    authState: { user },
  } = useAuth();
  const [users, setUsers] = useState([]);

  return (

    <>
      <div className="justify-center p-10">
        <div className="flex flex-col items-center">
          <img src={Logo} alt="Logo" className="h-80" />
          <h2 className="text-2xl text-red-500">User Dashboard</h2>
          <p className="text-lg">Welcome, {user}!</p>
          <Logout />
        </div>
      </div>
    </>

  );
}

export default UserDashboard;

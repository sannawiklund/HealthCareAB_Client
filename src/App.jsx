import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import Unauthorized from "./components/Unauthorized";
import Home from "./components/Home";
import RequireAuth from "./components/RequireAuth";
import Register from "./components/Register"; 
import UserPage from "./components/UserPage";
import './index.css';

import ScheduleAvailability from "./components/scheduleAvaliability";

function App() {
  return (
    <AuthProvider>
      <div className="content">
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/register" element={<Register />} /> 
            <Route
              path="/user/dashboard"
              element={
                <RequireAuth allowedRoles={["user"]}>
                  <UserDashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <RequireAuth allowedRoles={["admin"]}>
                  <AdminDashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/scheduleavaliability"
              element={
                <RequireAuth allowedRoles={["admin"]}>
                  <ScheduleAvailability />
                </RequireAuth>
              }
            />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/userpage" element={<UserPage/>} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;

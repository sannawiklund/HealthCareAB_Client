import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/health_care_logo.svg";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    roles: [],
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    dateOfBirth: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      roles: checked
        ? [...prev.roles, value]
        : prev.roles.filter((role) => role !== value),
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5148/api/auth/register",
        formData
      );
      console.log("Registration successful:", response.data);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Registration failed:", error.response || error);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white p-4">
      <div className="text-center w-full max-w-md">
        <img src={Logo} alt="Logo" className="h-48 mx-auto" />
        <h2 className="text-2xl font-semibold mt-4 text-gray-800 mb-4">Register</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
      </div>
  
      <form
        className="w-full max-w-md bg-cyan-50 rounded-2xl shadow-lg p-6"
        onSubmit={handleRegister}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className="p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className="p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              name="address"
              type="text"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              required
              className="p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
              className="w-full mt-1 p-2 border rounded-md focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700">Roles</label>
            <div className="flex space-x-4 mt-1">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value="user"
                  onChange={handleRoleChange}
                  className="rounded focus:ring-2 focus:ring-blue-500"
                />
                <span>User</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value="admin"
                  onChange={handleRoleChange}
                  className="rounded focus:ring-2 focus:ring-blue-500"
                />
                <span>Admin</span>
              </label>
            </div>
          </div>
  
          <button
            type="submit"
            className="w-full py-2 px-4 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;

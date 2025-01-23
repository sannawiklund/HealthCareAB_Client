import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    roles: [],
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form
        className="p-6 bg-white rounded-lg shadow-lg w-80 space-y-4"
        onSubmit={handleRegister}
      >
        <div>
          <label className="block text-gray-700">Username:</label>
          <input
            name="username"
            type="text"
            value={formData.username}
            onChange={handleInputChange}
            required
            className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700">Password:</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700">Roles:</label>
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
          className="w-full py-2 px-4 bg-teal-600 text-white font-semibold rounded hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;

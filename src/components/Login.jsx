import { useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const { setAuthState } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5148/api/auth/login",
        credentials,
        {
          withCredentials: true,
        }
      );

      const { username, roles, userId } = response.data;
      
      console.log("Response from server:", response.data); // Detta kommer att visa hela svaret från servern
      // Se till att vi sätter 'user' till det hämtade 'username'
      setAuthState({
        isAuthenticated: true,
        user: username,  // Sätt användarnamnet här
        roles: roles,
        userId: userId,
      });

      if (roles.includes("admin")) {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/user/dashboard", { replace: true });
      }
    } catch (error) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
        onSubmit={handleLogin}
      >
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="username">
            Username:
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={credentials.username}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
            Password:
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={credentials.password}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Login
        </button>

        <div className="text-center mt-4">
          <h2 className="text-lg font-semibold">Don't have an account? Register here!</h2>
          <Link
            to="/register"
            className="inline-block mt-3 px-6 py-2 bg-teal-600 text-white font-semibold rounded hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;

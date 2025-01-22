import Logo from "../assets/health_care_logo.svg";
import { Link } from "react-router-dom";

// start page

const Home = () => (
  <>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <img src={Logo} alt="Logo" className="h-80" /> 
      <h1 className="text-3xl font-semibold mt-6">Health Care Appointment App</h1>
      <div className="mt-12">
        <Link
          to="/login"
          className="inline-block px-8 py-3 bg-cyan-500 text-white font-semibold text-lg rounded-lg hover:bg-teal-500 transform hover:translate-y-[-3px] transition-all duration-300"
        >
          Login
        </Link>
      </div>
    </div>
  </>
);

export default Home;

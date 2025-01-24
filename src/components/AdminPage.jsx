import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Logo from "../assets/health_care_logo.svg";

function AdminPage() {
    // using custom hook to check if the user i authenticated and has the correct role
    const {
        authState: { admin },
    } = useAuth();
    const [users, setUsers] = useState([]);

    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <img src={Logo} alt="Logo" className="h-80" />
                <h2 className="text-2xl font-semibold mt-6">Your Profile</h2>
                {/* Might add possibility to add a picure later, which would be shown here */}
                <p className="text-lg mt-2"> { user } </p>
            </div>

            <div>
                <h2>Personal information</h2>
                <p>Profession: { } </p>
                <p>Date of birth: { } </p>

                <h2>Contact information</h2>
                <p>Address: { } </p>
                <p>Email: { } </p>
                <p>Phone: { } </p>

            </div>
        </>
    )
}

export default AdminPage;

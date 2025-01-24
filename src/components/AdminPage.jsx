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


        </>
    )
}

export default AdminPage;

import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Logo from "../assets/health_care_logo.svg";

function UserPage() {
    // using custom hook to check if the user i authenticated and has the correct role
    const {
        authState: { user },
    } = useAuth();
    const [users, setUsers] = useState([]);

    return (
        <>


        </>
    )
}

export default UserPage;

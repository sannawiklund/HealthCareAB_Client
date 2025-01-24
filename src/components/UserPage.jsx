import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import Logo from "../assets/health_care_logo.svg";

function UserPage() {
    // Checks for auth.
    const { authState } = useAuth();
    const { user } = authState;

    console.log("Auth state on UserPage:", authState);
    const userId = authState.userId;
    console.log(userId);
    //Detta ger mig rätt userId


    const [userData, setUserData] = useState();

    const [error, setError] = useState();


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5148/userpage/${userId}`,
                );
                const test = await response.data;
                console.log(test);

                setUserData(test);

            }
            catch (error) {
                setError(error.response ? error.response.data.message : "An error occured");
            }
        };

        //Check ifall användaren uppdateras, isf hämtas ny data. Denna borde kunna förfinas.
        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <img src={Logo} alt="Logo" className="h-80" />
                <h2 className="text-2xl font-semibold mt-6">Your Profile</h2>
                {/* Might add possibility to add a picure later, which would be shown here */}
                {userData && 
                <p className="text-lg mt-2"> Hej {userData.firstName}  </p>
                }
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

export default UserPage;

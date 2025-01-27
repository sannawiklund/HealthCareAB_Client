import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import Logo from "../assets/health_care_logo.svg";

function UserPage() {
    // Checks for auth state
    const { authState } = useAuth();
    const { user } = authState;

    //Plockar ut userId och använder i get-strängen. Kanske inte optimal lösning
    const userId = authState.userId;

    const [userData, setUserData] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5148/userpage/${userId}`,
                );

                //Inväntar respons från databasen för att den inte ska kasta error direkt och fastna där.
                const userInformation = await response.data;
                setUserData(userInformation);

            }
            catch (error) {
                setError(error.response ? error.response.data.message : "An error occured");
            }
        };

        //Check ifall användaren uppdateras, isf hämtas ny data
        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <div className="flex flex-col items-center min-h-screen bg-white p-4">

                {/* Header Section */}
                <div className="text-center w-full max-w-md">
                    <img src={Logo} alt="Logo" className="h-48 mx-auto" />
                    <h2 className="text-2xl font-semibold mt-4 text-gray-800">Your Profile</h2>
                     {/* Might add possibility to add a profile picure later, which would be shown here */}
                    {userData && (
                        <p className="text-lg mt-2 text-gray-600">Hello, {userData.firstName}</p>
                    )}
                </div>

                <div className="w-full max-w-md mt-8 bg-cyan-50 rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Personal Information</h2>
                    <div className="mt-4 space-y-2 text-gray-800">
                        {/* Mha userdata && kollar man så userData är truthy */}
                        {userData && (
                            <p>
                                <span className="font-medium">Username:</span> {userData.username ?? 'No value given'}
                            </p>
                        )}
                        {userData && (
                            <p>
                                <span className="font-medium">Gender:</span> {userData.gender ?? 'No value given'}
                            </p>
                        )}
                        {userData && (
                            <p>
                                <span className="font-medium">Date of birth:</span> {userData.dateOfBirth ?? 'No value given'}
                            </p>
                        )}
                    </div>

                    <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mt-6">Contact Information</h2>
                    <div className="mt-4 space-y-2 text-gray-700">
                        {userData && (
                            <p>
                                <span className="font-medium">Name:</span> {userData.firstName ?? 'No value given'}
                            </p>
                        )}
                        {userData && (
                            <p>
                                <span className="font-medium">Surname:</span> {userData.lastName ?? 'No value given'}
                            </p>
                        )}
                        {userData && (
                            <p>
                                <span className="font-medium">Address:</span> {userData.address ?? 'No value given'}
                            </p>
                        )}
                        {userData && (
                            <p>
                                <span className="font-medium">Email:</span> {userData.email ?? 'No value given'}
                            </p>
                        )}
                        {userData && (
                            <p>
                                <span className="font-medium">Phone:</span> {userData.phone ?? 'No value given'}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserPage;

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
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5148/userpage/${userId}`,
                    {
                        withCredentials: true // Viktigt för att cookies skickas med
                    }
                );

                //Inväntar respons från databasen för att den inte ska kasta error direkt och fastna där.
                const userInformation = await response.data;

                //Konverterar datumsträngen, klipper bort tiden genom split vid T.
                if (userInformation.dateOfBirth) {
                    userInformation.dateOfBirth = new Date(userInformation.dateOfBirth)
                        .toISOString()
                        .split("T")[0];
                }

                setUserData(userInformation);
                setEditedData(userInformation); //Så den har ett värde från start

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedData((prev) => ({ ...prev, [name]: value }));
    }

    const handleSave = async () => {
        try {
            const response = await axios.put(
                `http://localhost:5148/userpage/${userId}`,
                editedData,
                { withCredentials: true }
            );

            setSuccessMessage(response.data);
            setIsEditing(false);
            setUserData(editedData)
        }
        catch (error) {
            setError(error.response ? error.response.data.message : "Failed to update user data")

        };
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            {/* Header Section */}
            <div className="flex flex-col items-center min-h-screen bg-white p-4">
                <div className="text-center w-full max-w-md">
                    <img src={Logo} alt="Logo" className="h-48 mx-auto" />
                    <h2 className="text-2xl font-semibold mt-4 text-gray-800">
                        Your Profile</h2>
                    {/* Mha userdata && kollar man så userData är truthy */}
                    {userData && <p className="text-lg mt-2 text-gray-600">
                        Hello, {userData.firstName}</p>}
                </div>

                {/* User information section */}
                <div className="w-full max-w-md mt-8 bg-cyan-50 rounded-2xl shadow-lg p-6 mb-10">
                    
                    <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                        Personal Information</h2>

                    {successMessage && (
                        <p className="text-green-500 text-sm mt-2">{successMessage}</p>
                    )}

                    {/* Om editing är true visas edit mode, annars bara datan */}
                    <div className="mt-4 space-y-4">
                        {isEditing ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={editedData.username || ""}
                                        onChange={handleInputChange}
                                        className="p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <p>
                                    <span className="font-medium">
                                        Username:</span> {userData?.username ?? "No value given"}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Gender:</span> {userData?.gender ?? "No value given"}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Date of birth:</span> {userData?.dateOfBirth ?? "No value given"}
                                </p>
                            </>
                        )}
                    </div>

                    <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mt-3">
                        Contact Information</h2>
                    
                    {/* Om editing är true visas edit mode, annars bara datan */}
                    <div className="mt-2 space-y-3">
                        {isEditing ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={editedData.firstName || ""}
                                        onChange={handleInputChange}
                                        className="p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={editedData.lastName || ""}
                                        onChange={handleInputChange}
                                        className="p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={editedData.email || ""}
                                        onChange={handleInputChange}
                                        className="p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Phone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={editedData.phone || ""}
                                        onChange={handleInputChange}
                                        className="p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <p>
                                    <span className="font-medium">
                                        First Name:</span> {userData?.firstName ?? "No value given"}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Last Name:</span> {userData?.lastName ?? "No value given"}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Email:</span> {userData?.email ?? "No value given"}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Phone:</span> {userData?.phone ?? "No value given"}
                                </p>
                            </>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="mt-6 flex justify-between">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md">
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="bg-cyan-500 text-white px-4 py-2 rounded-lg shadow-md">
                                Save
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="mt-6 bg-cyan-500 text-white px-4 py-2 rounded-lg shadow-md">
                            Edit Information
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}

export default UserPage;

import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import Logo from "../assets/health_care_logo.svg";
import { useNavigate } from "react-router-dom";

function UserPage() {
    const navigate = useNavigate();
    const { authState } = useAuth();
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
                    { withCredentials: true }
                );
                const userInformation = await response.data;
                if (userInformation.dateOfBirth) {
                    userInformation.dateOfBirth = new Date(userInformation.dateOfBirth)
                        .toISOString()
                        .split("T")[0];
                }
                setUserData(userInformation);
                setEditedData(userInformation);
            } catch (error) {
                setError(error.response ? error.response.data.message : "An error occurred");
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const response = await axios.put(
                `http://localhost:5148/userpage/${userId}`,
                editedData,
                { withCredentials: true }
            );
            setSuccessMessage(response.data);
            setIsEditing(false);
            setUserData(editedData);
        } catch (error) {
            setError(error.response ? error.response.data.message : "Failed to update user data");
        }
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="flex flex-col items-center min-h-screen bg-white p-6">
            <div className="text-center w-full max-w-lg">
                <img src={Logo} alt="Logo" className="h-48 mx-auto" />
                {/* <h2 className="text-2xl font-semibold mt-4 text-gray-800">Your Profile</h2> */}
                {/* {userData && <p className="text-lg mt-2 text-gray-600">Hello, {userData.firstName}</p>} */}
            </div>

            <div className="w-full max-w-lg mt-8 bg-cyan-50 rounded-2xl shadow-lg p-8">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Personal Information</h2>
                {successMessage && <p className="text-green-500 text-sm mt-2">{successMessage}</p>}

                <div className="mt-6 space-y-5">
                    {isEditing ? (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={editedData.username || ""}
                                    onChange={handleInputChange}
                                    className="p-2 mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <p><span className="font-medium">Username:</span> {userData?.username ?? "No value given"}</p>
                            <p><span className="font-medium">Gender:</span> {userData?.gender ?? "No value given"}</p>
                            <p><span className="font-medium">Date of birth:</span> {userData?.dateOfBirth ?? "No value given"}</p>
                        </>
                    )}
                </div>

                <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mt-6">Contact Information</h2>

                <div className="mt-6 space-y-5">
                    {isEditing ? (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={editedData.firstName || ""}
                                    onChange={handleInputChange}
                                    className="p-2 mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={editedData.lastName || ""}
                                    onChange={handleInputChange}
                                    className="p-2 mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editedData.email || ""}
                                    onChange={handleInputChange}
                                    className="p-2 mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={editedData.phone || ""}
                                    onChange={handleInputChange}
                                    className="p-2 mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <p><span className="font-medium">First Name:</span> {userData?.firstName ?? "No value given"}</p>
                            <p><span className="font-medium">Last Name:</span> {userData?.lastName ?? "No value given"}</p>
                            <p><span className="font-medium">Email:</span> {userData?.email ?? "No value given"}</p>
                            <p><span className="font-medium">Phone:</span> {userData?.phone ?? "No value given"}</p>
                        </>
                    )}
                </div>

                <div className="mt-8 flex justify-between">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="bg-red-500 text-white px-5 py-2 rounded-lg shadow-md">
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="bg-cyan-500 text-white px-5 py-2 rounded-lg shadow-md">
                                Save
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-cyan-500 text-white px-5 py-2 rounded-lg shadow-md">
                                Edit Information
                            </button>
                            <button
                                className="bg-cyan-800 hover:bg-cyan-950 text-white font-semibold px-6 py-2 rounded-lg"
                                onClick={() => navigate("/user/dashboard")}>
                                Return to Dashboard
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserPage;

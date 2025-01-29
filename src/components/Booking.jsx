import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Booking() {
    const { authState } = useAuth();
    const userId = authState.userId;
    const navigate = useNavigate();

    const [availableSlots, setAvailableSlots] = useState([]);
    const [error, setError] = useState();
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const getAvailableTimeSlots = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5148/availability/${userId}`,
                    { withCredentials: true }
                );

                const timeNow = new Date();

                const sortedSlots = response.data
                    .filter(slot => new Date(slot.availableSlots) > timeNow) // Filtrerar bort tider som passerat
                    .sort((a, b) => new Date(a.availableSlots) - new Date(b.availableSlots)); //Sorterar så närmst i tid kommer först

                setAvailableSlots(sortedSlots);
            } catch (error) {
                setError(error.response ? error.response.data.message : "An error occurred");
            }
        };

        getAvailableTimeSlots();
    }, [userId]);

    // Function to format date and time
    const formatDateAndTime = (dateTime) => {
        const date = new Date(dateTime);
        const formattedDate = date.toISOString().split("T")[0]; // "2025-01-28"
        const formattedTime = date.toTimeString().split(" ")[0].slice(0, 5); // "14:00"
        return `Date: ${formattedDate} | Time: ${formattedTime}`;
    };

    // Vad som händer när man trycker på "Boka" (POST)
    const handleSubmit = async (slot) => {
        try {
            // Konvertera tillbaka till rätt ISO-format
            const formattedDateTime = new Date(slot.availableSlots).toISOString();

            const response = await axios.post(
                `http://localhost:5148/${userId}`,
                {
                    CaregiverId: slot.caregiverId,
                    AppointmentTime: formattedDateTime, // Skicka omformaterad tid
                },
                { withCredentials: true }
            );

            if (response.status === 200) {
                alert("Booking successfully added!");
                navigate("/user/dashboard");
            }
        } catch (error) {
            console.error("Error response:", error.response);
            alert("Failed to add booking. Please try again.");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Available Time Slots</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {availableSlots.length > 0 ? (
                    availableSlots.map((slot, index) => (
                        <div
                            key={index}
                            className="bg-cyan-50 shadow-md rounded-lg p-4 flex flex-col items-center"
                        >
                            <p className="text-lg font-medium mb-2">
                                Caregiver: {slot.caregiverId}
                            </p>

                            {/* Display formatted date and time */}
                            <p className="text-sm text-gray-600 mb-4">
                                {formatDateAndTime(slot.availableSlots)}
                            </p>

                            {console.log(slot)}
                            <button
                                className="mt-4 bg-cyan-500 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg"
                                onClick={() => handleSubmit(slot)} // Trigger handleSubmit on button click
                            >
                                Book
                            </button>
                        </div>

                        //Lägg till en knapp som heter "Return" eller liknande som routar till UserDashboard om man ångrar sig. Just nu finns det inget sätt att backa
                    ))
                ) : (
                    <p className="text-gray-500 text-center col-span-full">No available slots at the moment.</p>
                )}
            </div>

            {successMessage && <p className="text-green-500 mt-4 text-center">{successMessage}</p>}
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </div>
    );
}

export default Booking;

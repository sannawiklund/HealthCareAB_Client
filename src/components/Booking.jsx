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

    useEffect(() => {
        const getAvailableTimeSlots = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5148/availability/${userId}`,
                    { withCredentials: true }
                );

                const timeNow = new Date();

                let individualSlots = [];

                for (let i = 0; i < response.data.length; i++) {
                    const slots = response.data[i];
                    for (let o = 0; o < slots.availableSlots.length; o++) {
                        individualSlots.push({
                            "caregiverId": slots.caregiverId,
                            "availableSlots": slots.availableSlots[o]
                        });
                    }
                }

                const sortedSlots = individualSlots
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
            <h1 className="text-2xl font-bold mb-4 text-center">Available Time Slots</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {availableSlots.length > 0 ? (
                    availableSlots.map((slot, index) => (
                        <div
                            key={index}
                            className="bg-cyan-50 shadow-md rounded-lg p-4 flex flex-col items-center"
                        >
                            <p className="text-lg font-medium mb-2">
                                Caregiver: Doctor Doctorssen
                            </p>

                            <p className="text-sm text-gray-600 mb-4">
                                {formatDateAndTime(slot.availableSlots)}
                            </p>

                            <button
                                className="mt-2 bg-cyan-500 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg"
                                onClick={() => handleSubmit(slot)}
                            >
                                Book
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center col-span-full">
                        No available slots at the moment.
                    </p>
                )}
            </div>

            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

            {/* Return-knapp centrerad under sista raden */}
            <div className="flex justify-center mt-6">
                <button
                    className="bg-cyan-800 hover:bg-cyan-950 text-white font-semibold py-2 px-6 rounded-lg"
                    onClick={() => navigate("/user/dashboard")}
                >
                    Return to Dashboard
                </button>
            </div>
        </div>
    );
}

export default Booking;

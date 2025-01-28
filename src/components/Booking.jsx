import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Booking() {

    const { authState } = useAuth();
    const userId = authState.userId;
    console.log(userId);
    const navigate = useNavigate();

    const [availableSlots, setAvaliableSlots] = useState();
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState();


    useEffect(() => {
        // Denna metod ska automatiskt köras när man klickar på "Book" i UserDashboard 
        const getAvaliableTimeSlots = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5148/availability/${userId}`,
                    {
                        withCredentials: true // Viktigt för att cookies skickas med
                    }
                );

                //Inväntar respons från databasen för att den inte ska kasta error direkt och fastna där.
                const avaliableSlots = await response.data;

                console.log(availableSlots);
                setAvaliableSlots(avaliableSlots);
            }
            catch (error) {
                setError(error.response ? error.response.data.message : "An error occured");
            }
        };

        //Check ifall någon är inloggad, isf hämtas alla tillgängliga tider
        if (userId) {
            getAvaliableTimeSlots();
        }
    }, [userId]);

    //     // Vad som händer när man trycker på "Boka" (POST)
    //    const handleSubmit = async () => { 

    //     if (response.status === 201) {
    //         alert("Booking successfully added!");
    //         navigate("/user/dashboard");
    //       }
    //     } catch (error) {
    //       console.error("Error response:", error.response);
    //       alert("Failed to add booking. Please try again.");
    //     }

    //     //Inväntar respons från databasen för att den inte ska kasta error direkt och fastna där.
    //     const avaliableSlots = await response.data;

    //     }

    //     // Spara bokningen
    //     const handleSaveBooking = () => {

    //     }

    return (
        <>
            <h2>HejHopp</h2>

        </>
    );

}

export default Booking;
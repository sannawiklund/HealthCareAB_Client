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
            <div className="flex flex-col items-center min-h-screen bg-gray-100">

                <div>
                    <img src={Logo} alt="Logo" className="h-80" />
                    <h2 className="text-2xl font-semibold mt-6">Your Profile</h2>
                    {/* Might add possibility to add a picure later, which would be shown here */}
                    {userData &&
                        <p className="text-lg mt-2"> Hej {userData.firstName}  </p>
                    }
                </div>

                <div>
                    <h2>Personal information</h2>
                    {/* Mha userdata && kollar man så userData är truthy */}
                    {userData &&
                        <p>Username: {userData.username ?? 'No value given'} </p>
                    }
                    {userData &&
                        <p>Gender: {userData.gender ?? 'No value given'} </p>
                    }
                    {userData &&
                        <p>Date of birth: {userData.dateOfBirth ?? 'No value given'} </p>
                    }

                    <h2>Contact information</h2>
                    {userData &&
                        <p>Name: {userData.firstName ?? 'No value given'} </p>
                    }
                    {userData &&
                        <p>Surname: {userData.lastName ?? 'No value given'} </p>
                    }
                    {userData &&
                        <p>Address: {userData.address ?? 'No value given'} </p>
                    }
                    {userData &&
                        <p>Email: {userData.email ?? 'No value given'} </p>
                    }
                    {userData &&
                        <p>Phone: {userData.phone ?? 'No value given'} </p>
                    }

                </div>
            </div>
        </>
    )
}

export default UserPage;

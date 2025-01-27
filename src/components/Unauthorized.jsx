import { useNavigate } from "react-router-dom";

// unauthorized page that shows if a user tries to access a page and does
// not have the correct role for it

function Unauthorized() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // navigate back to the previous page
  };

  return (

    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-3xl text-orange-500">Unauthorized</h2>
      <p className="text-lg mt-2">You do not have permission to view this page.</p>
      <button
        onClick={goBack}
        className="mt-6 px-8 py-2 bg-teal-600 text-white font-semibold rounded-lg transition-transform transform hover:bg-teal-400 hover:translate-y-1 hover:shadow-lg"
      >
        Go Back
      </button>
    </div>
  );
}

export default Unauthorized;

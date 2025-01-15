import { useNavigate } from "react-router-dom"

const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 w-full">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-blue-500">Unauthorized</h1>
        <p className="mt-2 text-lg text-gray-600">
        You do not have access to the requested page.
        </p>
        <div className="mt-6">
          <button
            onClick={goBack}
            className="px-6 py-3 text-white bg-blue-500 rounded-lg shadow hover:bg-blue-600 transition-colors"
          >
            Go Back
          </button>
        </div>
        
      </div>
    </div>
    )
}

export default Unauthorized

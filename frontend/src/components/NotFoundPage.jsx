import React from "react";
import { useNavigate } from "react-router-dom";



const NotFoundPage = () => {

  const navigate = useNavigate()

  const goBack = () => {
  navigate(-1)
}
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 w-full">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-500">404</h1>
        <h2 className="mt-4 text-4xl font-semibold text-gray-800">
          Page Not Found
        </h2>
        <p className="mt-2 text-lg text-gray-600">
          Sorry, the page you are looking for doesn’t exist or has been moved.
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
  );
};

export default NotFoundPage;

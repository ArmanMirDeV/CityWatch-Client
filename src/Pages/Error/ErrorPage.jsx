import React from "react";
import { Link } from "react-router";
import Lottie from "lottie-react";
import errorAnimation from "../../assets/animations/error.json"; 

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      {/* Lottie Animation */}
      <div className="w-full max-w-lg mb-8">
        <Lottie animationData={errorAnimation} loop={true} />
      </div>

      {/* Text */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 text-center">
        Oops! Page Not Found
      </h1>
      <p className="text-gray-600 text-lg md:text-xl mb-6 text-center">
        The page you are looking for does not exist or has been moved.
      </p>

      {/* Go Home Button */}
      <Link to="/">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 cursor-pointer rounded-full transition-all">
          Go Back Home
        </button>
      </Link>
    </div>
  );
};

export default ErrorPage;

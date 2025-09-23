import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Nav from "../../components/Nav";

const EmailSent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // query params: ?type=welcome OR ?type=reset
  const params = new URLSearchParams(location.search);
  const type = params.get("type") || "default";

  let title = "📧 Email Sent!";
  let message = "Please check your inbox for further instructions.";
  let buttonText = "Back to Home";
  let buttonLink = "/";

  if (type === "welcome") {
    title = "🎉 Welcome to Foodie Express!";
    message =
      "Thanks for registering! We’ve sent you a welcome email with more details. Let’s start exploring delicious food.";
    buttonText = "Start Ordering 🍔";
    buttonLink = "/";
  }

  if (type === "reset") {
    title = "🔑 Password Reset Email Sent!";
    message =
      "We’ve sent you an email with a password reset button. Please check your inbox and follow the instructions.";
    buttonText = "Go to Login";
    buttonLink = "/login";
  }
  
  return (
    
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">

      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
        <h2 className="text-3xl font-bold text-orange-500 mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={() => navigate(buttonLink)}
          className="bg-orange-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-orange-600 transition"
        >
          {buttonText}
        </button>
        <p className="mt-6 text-xs text-gray-400">
          Foodie Express © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default EmailSent;

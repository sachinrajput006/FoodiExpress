import React from "react";
import { Link } from "react-router-dom";
import Nav from "../../components/Nav"; // ✅ same Nav used here

const EmailSentSuccess = () => {
  return (
    <>
      <Nav /> {/* ✅ Top navigation */}
      <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">
            📧 Email Sent!
          </h2>
          <p className="text-gray-700 mb-6">
            We’ve sent a password reset link to your email.  
            Please check your inbox (and spam folder).
          </p>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </>
  );
};

export default EmailSentSuccess;

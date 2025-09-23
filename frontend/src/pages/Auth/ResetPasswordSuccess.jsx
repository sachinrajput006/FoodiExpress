import React from "react";
import { Link } from "react-router-dom";
import Nav from "../../components/Nav";

const ResetPasswordSuccess = () => {
  return (
    <>
      <Nav />
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            ✅ Password Reset Successful
          </h2>
          <p className="text-gray-700 mb-6">
            Your password has been updated successfully. <br />
            You can now log in with your new password.
          </p>
          <Link
            to="/login"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordSuccess;

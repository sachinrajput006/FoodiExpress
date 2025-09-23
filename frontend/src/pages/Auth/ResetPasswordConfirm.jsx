import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from "../../components/Nav";

const ResetPasswordConfirm = () => {
  const { uidb64, token } = useParams();  // ✅ matches App.jsx
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleNext = (e) => {
    e.preventDefault();
    setError("");
    if (!newPassword) {
      setError("Please enter a new password ❌");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!confirmPassword) {
      setError("Please confirm your password ❌");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match ❌");
      return;
    }

    try {
      await axios.post(
        `http://127.0.0.1:8000/accounts/password-reset-confirm/${uidb64}/${token}/`,
        { new_password: newPassword }
      );
      navigate("/reset-password-success"); // ✅ fixed path
    } catch (err) {
      setError("Invalid or expired link ❌");
    }
  };

  return (
    <>
      <Nav />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <form className="bg-white p-8 shadow rounded w-[350px]">
          <h2 className="text-2xl font-bold mb-6 text-center text-green-600">
            Set New Password
          </h2>
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}

          {step === 1 && (
            <>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 mb-6 border rounded"
              />
              <button
                onClick={handleNext}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Next
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 mb-4 border rounded"
              />
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                >
                  Reset Password
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </>
  );
};

export default ResetPasswordConfirm;

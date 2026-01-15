import React, { useState } from "react";
import axios from "axios";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/accounts/password-reset/", { email });
      setMessage("If the email exists, a reset link has been sent ✅");
    } catch {
      setMessage("Something went wrong ❌");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow rounded w-[350px]">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
        {message && <p className="text-center mb-4 text-green-600">{message}</p>}
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded"
          required
        />
        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default PasswordReset;

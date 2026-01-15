import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from "../../components/Nav";

const Register = () => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    password2: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.password2) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/accounts/register/", form);

      // ✅ Redirect to EmailSent page with type=welcome
      navigate("/email-sent?type=welcome");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        const errors = err.response.data;
        const errorMessages = Object.values(errors).flat().join('\n');
        alert(`Registration failed:\n${errorMessages}`);
      } else {
        alert("Registration failed! Please check your details.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <Nav />

      {/* Form container */}
      <div className="flex justify-center items-center pt-16 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-8 w-[350px]"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-green-600">
            Register
          </h2>

          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={form.first_name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 mb-4 border rounded-md"
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={form.last_name}
            onChange={handleChange}
            className="w-full px-4 py-2 mb-4 border rounded-md"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 mb-4 border rounded-md"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 mb-4 border rounded-md"
          />
          {/* Password Requirements */}
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm font-semibold mb-2">Password must contain:</p>
            <ul className="text-xs text-gray-600 list-disc list-inside">
              <li>At least 8 characters</li>
              <li>At least one uppercase letter</li>
              <li>At least one lowercase letter</li>
              <li>At least one number</li>
              <li>At least one special character (!@#$%^&* etc.)</li>
            </ul>
          </div>

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 mb-4 border rounded-md"
          />
          <input
            type="password"
            name="password2"
            placeholder="Confirm Password"
            value={form.password2}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 mb-6 border rounded-md"
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
          >
            Register
          </button>

          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-green-600 hover:underline"
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;

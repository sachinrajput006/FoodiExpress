import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import Nav from "../../components/Nav";
import { dataContext } from "../../context/DataContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useContext(dataContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("/accounts/login/", { username, password });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      // If your backend returns user info
      setUser(res.data.user || null);

      setMessage("Login successful ✅");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      console.error("Login error:", err);
      const errorMsg =
        err.response?.data?.detail || "Invalid credentials ❌";
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Nav />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <form
          className="bg-white shadow-md rounded-lg p-8 w-[350px]"
          onSubmit={handleLogin}
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-green-600">
            Login
          </h2>

          {message && (
            <p
              className={`text-center mb-4 text-sm ${
                message.includes("successful") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <input
            type="text"
            placeholder="Username, Email, or Phone"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 mb-4 border rounded-md outline-none focus:ring-2 focus:ring-green-400"
          />

          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-sm text-gray-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-green-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="my-4 text-center text-gray-500 text-sm">OR</div>

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300"
          >
            Create New Account
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;

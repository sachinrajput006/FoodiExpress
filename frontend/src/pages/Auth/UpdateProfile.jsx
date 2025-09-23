import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Nav from "../../components/Nav";
import { dataContext } from "../../context/DataContext";
import defaultAvatar from "../../assets/default-avatar.png"; // ✅ Make sure this file exists

const UpdateProfile = () => {
  const { user, setUser } = useContext(dataContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zip_code: "",
    date_of_birth: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        phone: user.phone || "",
        gender: user.gender || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
        zip_code: user.zip_code || "",
        date_of_birth: user.date_of_birth || "",
      });
      setProfilePicture(user.profile_picture || null);
    }
  }, [user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePictureChange = (e) => setProfilePicture(e.target.files[0]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("access");
    if (!token) {
      setMessage("You must be logged in to update profile ❌");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (profilePicture instanceof File)
        data.append("profile_picture", profilePicture);

      const res = await axios.put(
        "http://127.0.0.1:8000/accounts/profile/update/",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser(res.data);
      setMessage("Profile updated successfully ✅");
      navigate("/profile");
    } catch (err) {
      console.error(err.response || err);
      // Check if error response has field errors
      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data === "object") {
          // Format field errors into a string message
          const fieldErrors = Object.entries(data)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
            .join(" | ");
          setMessage(fieldErrors);
        } else {
          setMessage(data.detail || "Failed to update ❌");
        }
      } else {
        setMessage("Failed to update ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Nav />
      <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-green-600 mb-6">
          Update Profile
        </h2>

        {message && (
          <p
            className={`mb-4 text-center text-sm font-medium ${
              message.includes("successfully")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={
              profilePicture instanceof File
                ? URL.createObjectURL(profilePicture)
                : profilePicture || defaultAvatar
            }
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-green-500 shadow-md mb-3"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handlePictureChange}
            className="text-sm"
          />
        </div>

        {/* Form */}
        <form
          onSubmit={handleUpdate}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {Object.keys(formData).map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium mb-1 capitalize">
                {field.replace("_", " ")}
              </label>
              {field === "gender" ? (
                <select
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : field === "date_of_birth" ? (
                <input
                  type="date"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                />
              ) : (
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                />
              )}
            </div>
          ))}

          <div className="md:col-span-2">
            <button
              type="submit"
              className={`w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;

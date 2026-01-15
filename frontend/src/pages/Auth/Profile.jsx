import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import Nav from "../../components/Nav";
import { dataContext } from "../../context/context";
import defaultAvatar from "../../assets/default-avatar.png";

const BACKEND_HOST = "http://127.0.0.1:8000";

const resolveImageSrc = (img) => {
  if (!img) return defaultAvatar;
  if (typeof img === "string" && (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("//"))) return img;
  if (typeof img === "string") return `${BACKEND_HOST}${img.startsWith("/") ? "" : "/"}${img}`;
  return defaultAvatar;
};

const Profile = () => {
  const { user, setUser } = useContext(dataContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("about");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/accounts/profile/");
        setProfile(res.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Initialize form when user clicks edit
  const handleEdit = () => {
    setEditing(true);
    setFormData({
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      phone: profile.phone || "",
      address: profile.address || "",
      city: profile.city || "",
      state: profile.state || "",
      country: profile.country || "",
      zip_code: profile.zip_code || "",
      date_of_birth: profile.date_of_birth || "",
    });
    setProfilePicture(profile.profile_picture || null);
    setActiveTab("settings");
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (profilePicture instanceof File) {
        data.append("profile_picture", profilePicture);
      }

      // Debug: log FormData contents
      for (let pair of data.entries()) {
        console.log("FormData entry:", pair[0], pair[1]);
      }

      console.log("Sending profile update request...");
      const res = await api.patch("/accounts/profile/update/", data);
      console.log("Profile update response:", res);
      setProfile(res.data);
      setUser(res.data);
      setMessage("Profile updated successfully ✅");
      setEditing(false);
    } catch (err) {
      console.error(err);
      setMessage("Failed to update ❌");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-100">
        <Nav />
        <p className="text-center py-10 text-gray-500">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100">
      <Nav />
      <div className="max-w-4xl mx-auto mt-12 p-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          <img
            src={resolveImageSrc(profile.profile_picture)}
            alt="Profile"
            className="w-36 h-36 rounded-full object-cover border-4 border-green-500 shadow-md"
          />
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-800">
                {profile.first_name} {profile.last_name}
              </h1>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
                onClick={handleEdit}
              >
                Edit Profile
              </button>
            </div>
            <p className="text-gray-500 mt-1">{profile.username}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 bg-white rounded-2xl shadow p-4">
          <div className="flex border-b border-gray-200">
            {["about", "activity", "settings"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 font-semibold ${
                  activeTab === tab
                    ? "border-b-4 border-green-500 text-green-600"
                    : "text-gray-500 hover:text-green-500"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {activeTab === "about" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-green-600 mb-2">
                  About Me
                </h2>
                <p>
                  <strong>Full Name:</strong> {profile.first_name}{" "}
                  {profile.last_name}
                </p>
                <p>
                  <strong>Email:</strong> {profile.email}
                </p>
                <p>
                  <strong>Phone:</strong> {profile.phone || "Not provided"}
                </p>
                <p>
                  <strong>Gender:</strong> {profile.gender || "Not provided"}
                </p>
                <p>
                  <strong>Date of Birth:</strong>{" "}
                  {profile.date_of_birth || "Not provided"}
                </p>
                <p>
                  <strong>Address:</strong> {profile.address || "Not provided"},{" "}
                  {profile.city || ""}, {profile.state || ""},{" "}
                  {profile.country || ""}, {profile.zip_code || ""}
                </p>
              </div>
            )}

            {activeTab === "activity" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-green-600 mb-2">
                  Recent Activity
                </h2>
                <ul className="list-disc list-inside text-gray-700">
                  <li>Liked a post on 12 Sep 2025</li>
                  <li>Updated profile picture</li>
                  <li>Joined a new group</li>
                  <li>Completed a course</li>
                </ul>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-green-600 mb-2">
                  Settings
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
                {editing ? (
                  <form
                    onSubmit={handleUpdate}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {/* form fields */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Phone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        name="zip_code"
                        value={formData.zip_code}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">
                        Profile Picture
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProfilePicture(e.target.files[0])}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <p className="text-gray-700">
                    Click "Edit Profile" above to update your info.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

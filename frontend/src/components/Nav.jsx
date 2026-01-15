import React, { useContext, useState } from "react";
import { MdFastfood } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { FiShoppingBag } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
import { dataContext } from "../context/context";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

const Nav = () => {
  const { input, setInput, user, setUser, setShowCart } =
    useContext(dataContext);
  const items = useSelector((state) => state.cart) || [];
  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  const BACKEND_HOST = "http://127.0.0.1:8000";
  const resolveImage = (img) => {
    if (!img) return null;
    if (typeof img === "string" && (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("//"))) return img;
    if (typeof img === "string") return `${BACKEND_HOST}${img.startsWith("/") ? "" : "/"}${img}`;
    return null;
  };

  const handleLogout = () => {
    (async () => {
      try {
        const refresh = localStorage.getItem("refresh");
        // Call backend to blacklist refresh token
        if (refresh) {
          // use fetch to avoid depending on api instance here
          await fetch("http://127.0.0.1:8000/accounts/logout/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("access")
                ? `Bearer ${localStorage.getItem("access")}`
                : undefined,
            },
            body: JSON.stringify({ refresh }),
          });
        }
      } catch (e) {
        console.error("Backend logout failed:", e);
      } finally {
        // Always clear client-side tokens
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
      }
    })();
  };

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-[80px] flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <MdFastfood className="w-[35px] h-[35px] text-green-600" />
          <h1 className="font-bold text-2xl text-green-600">FoodieExpress</h1>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex gap-6 font-medium text-gray-700">
          <Link to="/" className="hover:text-green-600 transition">Home</Link>
          {user && <Link to="/orders" className="hover:text-green-600 transition">Orders</Link>}
        </nav>

        {/* Search */}
        <form className="hidden md:flex items-center bg-gray-100 px-4 h-[40px] rounded-md shadow-sm w-[250px] lg:w-[300px]" onSubmit={(e) => e.preventDefault()}>
          <IoSearch className="text-green-500 w-[20px] h-[20px] mr-2" />
          <input
            type="text"
            placeholder="Search food..."
            className="w-full bg-transparent outline-none text-[15px]"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoComplete="off"
          />
        </form>

        {/* Right side */}
        <div className="flex items-center gap-4 relative">
          {/* Cart */}
          <div
            className="w-[45px] h-[45px] bg-white flex justify-center items-center rounded-full shadow-md relative cursor-pointer hover:bg-green-50"
            onClick={() => setShowCart(true)}
          >
            <span className="absolute -top-1 -right-1 bg-green-600 text-white rounded-full px-1 text-xs font-bold">
              {items.length || 0}
            </span>
            <FiShoppingBag className="w-[22px] h-[22px] text-green-600" />
          </div>

          {/* Profile/Login */}
          {user ? (
            <div className="relative">
              <div
                className={`w-[45px] h-[45px] ${user?.profile_picture ? '' : 'bg-green-600 text-white'} flex justify-center items-center rounded-full cursor-pointer font-bold hover:scale-105 transition`}
                onClick={() => setDropdown(!dropdown)}
              >
                {user?.profile_picture ? (
                  <img src={resolveImage(user.profile_picture)} alt="profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  user?.first_name?.trim() ? user.first_name[0].toUpperCase() : (user?.username ? user.username[0].toUpperCase() : <FaUserCircle className="w-[26px] h-[26px]" />)
                )}
              </div>

              {dropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                  <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-green-50" onClick={() => setDropdown(false)}>Profile</Link>
                  <Link to="/update-profile" className="block px-4 py-2 text-gray-700 hover:bg-green-50" onClick={() => setDropdown(false)}>Update Profile</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => navigate("/login")} className="w-[45px] h-[45px] bg-green-600 text-white flex justify-center items-center rounded-full hover:scale-105 transition">
              <FaUserCircle className="w-[26px] h-[26px]" />
            </button>
          )}

          {/* Mobile Menu */}
          <button className="md:hidden text-green-600" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="md:hidden bg-white shadow-md absolute top-[80px] left-0 w-full z-40">
          <nav className="flex flex-col p-4 gap-3 font-medium text-gray-700">
            <Link to="/" onClick={() => setMobileMenu(false)} className="hover:text-green-600 transition">Home</Link>
            {user && (
              <>
                <Link to="/profile" onClick={() => setMobileMenu(false)} className="hover:text-green-600 transition">Profile</Link>
                <Link to="/update-profile" onClick={() => setMobileMenu(false)} className="hover:text-green-600 transition">Update Profile</Link>
                <Link to="/orders" onClick={() => setMobileMenu(false)} className="hover:text-green-600 transition">Orders</Link>
              </>
            )}
            {user ? (
              <button onClick={handleLogout} className="text-left hover:text-green-600 transition">Logout</button>
            ) : (
              <button onClick={() => { navigate("/login"); setMobileMenu(false); }} className="text-left hover:text-green-600 transition">Login / Register</button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Nav;

import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home";
import Footer from "./pages/Footer";
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Register from "./pages/Auth/Register";
import Profile from "./pages/Auth/Profile";
import EmailSentSuccess from "./pages/Auth/EmailSentSuccess";
import PasswordReset from "./pages/Auth/PasswordReset";
import ResetPasswordConfirm from "./pages/Auth/ResetPasswordConfirm";
import ResetPasswordSuccess from "./pages/Auth/ResetPasswordSuccess";
import EmailSent from "./pages/Auth/EmailSent";
import UpdateProfile from "./pages/Auth/UpdateProfile";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div style={{ flex: 1 }}>
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Auth */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
          <Route path="/email-sent-success" element={<EmailSentSuccess />} />
          <Route path="/reset-password" element={<PasswordReset />} />
          <Route
            path="/reset-password-confirm/:uidb64/:token"
            element={<ResetPasswordConfirm />}
          />

          <Route path="/reset-password-success" element={<ResetPasswordSuccess />} />
          <Route path="/email-sent" element={<EmailSent />} />


        </Routes>
      </div>
      <ToastContainer />
      <Footer />
    </div>
  );
};

export default App;

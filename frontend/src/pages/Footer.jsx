import React from "react";

const Footer = () => {
  return (
    <footer style={{ backgroundColor: "#222", color: "#fff", padding: "40px 20px", marginTop: "auto" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>

        {/* About Section */}
        <div style={{ flex: "1 1 250px", marginBottom: "20px" }}>
          <h3 style={{ marginBottom: "15px" }}>FoodieExpress</h3>
          <p>Delivering fresh and delicious meals straight to your door. Fast, reliable, and always tasty!</p>
        </div>

        {/* Contact Section */}
        <div style={{ flex: "1 1 250px", marginBottom: "20px" }}>
          <h4 style={{ marginBottom: "15px" }}>Contact</h4>
          <p>Email: support@foodieexpress.com</p>
          <p>Phone: +91 123 456 7890</p>
          <p>Address: 123, Food Street, Your City</p>
        </div>

        {/* Social Media Section */}
        <div style={{ flex: "1 1 250px", marginBottom: "20px" }}>
          <h4 style={{ marginBottom: "15px" }}>Follow Us</h4>
          <div style={{ display: "flex", gap: "15px" }}>
            <a href="#" style={{ color: "#fff", fontSize: "20px", textDecoration: "none" }}>🌐</a>
            <a href="#" style={{ color: "#fff", fontSize: "20px", textDecoration: "none" }}>📘</a>
            <a href="#" style={{ color: "#fff", fontSize: "20px", textDecoration: "none" }}>🐦</a>
            <a href="#" style={{ color: "#fff", fontSize: "20px", textDecoration: "none" }}>📸</a>
          </div>
        </div>

      </div>

      {/* Divider */}
      <hr style={{ borderColor: "#444", margin: "20px 0" }} />

      {/* Copyright */}
      <div style={{ textAlign: "center", fontSize: "14px" }}>
        &copy; {new Date().getFullYear()} FoodieExpress. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

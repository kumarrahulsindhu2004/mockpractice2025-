"use client";

import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  // const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Toggle menu & dropdown
  const handleLinkClick = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  // const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // ✅ Safe JSON parse
  const safeParse = (value) => {
    if (!value || value === "undefined" || value === "null") return null;
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  };

  // ✅ Fetch user from localStorage / API
  useEffect(() => {
    const storedUser = safeParse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);

    const token = safeParse(localStorage.getItem("token"));
    if (token) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        })
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        });
    }
  }, []);

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  // ✅ User initials helper
  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // ✅ Close body scroll when menu open
  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Logo */}
        {/* <Link to="/" className="navbar-brand" onClick={handleLinkClick}>
          🎯 Mock Practice
        </Link> */}
        <Link to="/" className="navbar-brand logo">
  <span className="logo-icon">P</span>
  <span className="logo-text">
    Mock<span className="logo-accent">P</span>
    <small>Practice Platform</small>
  </span>
</Link>


        {/* Hamburger for mobile */}
        <button
          className={`menu-toggle ${menuOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* Navigation Links */}
        <ul className={`navbar-nav ${menuOpen ? "open" : ""}`}>
          <li>
            <Link
              to="/practice"
              className={location.pathname === "/practice" ? "active" : ""}
              onClick={handleLinkClick}
            >
              Practice
            </Link>
          </li>
          <li>
            <Link
              to="/contest"
              className={location.pathname === "/leaderboard" ? "active" : ""}
              onClick={handleLinkClick}
            >
              Contest
            </Link>
          </li>
          {/* <li>
            <Link
              to="/learn"
              className={location.pathname === "/learn" ? "active" : ""}
              onClick={handleLinkClick}
            >
              Learn
            </Link>
          </li>
          <li>
            <Link
              to="/job"
              className={location.pathname === "/job" ? "active" : ""}
              onClick={handleLinkClick}
            >
              Job
            </Link>
          </li> */}



          {/* Mobile Buttons */}
          {!user ? (
            <li className="mobile-buttons">
              <Link
                to="/login"
                className="btn btn-outline mobile-btn"
                onClick={handleLinkClick}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="btn btn-primary mobile-btn"
                onClick={handleLinkClick}
              >
                Signup
              </Link>
            </li>
          ) : (
            <li className="mobile-buttons">
              

              <div
  className="profile-circle"
  onClick={() => navigate("/dashboard")}
  title="Go to Dashboard"
>
  {getInitials(user.name)}
</div>
                <button
          className="btn btn-outline mobile-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
            </li>
          )}
        </ul>

        {/* Desktop Buttons */}

        <div className="navbar-actions">
          {!user ? (
  <>
    <Link to="/login" className="btn btn-outline">Login</Link>
    <Link to="/signup" className="btn btn-primary">Signup</Link>
  </>
) : (
  // <div
  //   className="profile-circle"
  //   onClick={() => navigate("/dashboard")}
  //   title="Go to Dashboard"
  // >
  //   {getInitials(user.name)}
  // </div>
  <div className="header-user-actions">
    <div
      className="profile-circle"
      onClick={() => navigate("/dashboard")}
      title="Go to Dashboard"
    >
      {getInitials(user.name)}
    </div>

    <button
      className="btn btn-outline logout-btn"
      onClick={handleLogout}
    >
      Logout
    </button>
  </div>

  
)}

        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="menu-overlay show"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
    </nav>
  );
};

export default Header;
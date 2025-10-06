"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import "./Header.css"

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState(null) 
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Toggle menu
  const handleLinkClick = () => setMenuOpen(false)
  const toggleMenu = () => setMenuOpen(!menuOpen)
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen)

  // Fetch user from localStorage / API
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    const token = JSON.parse(localStorage.getItem("token"))
    if (token) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser(res.data.user)
          localStorage.setItem("user", JSON.stringify(res.data.user))
        })
        .catch(() => {
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          setUser(null)
        })
    }
  }, [])

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    navigate("/login")
  }

  // Get initials like Rahul Kumar → RK
  const getInitials = (name) => {
    if (!name) return ""
    const parts = name.trim().split(" ")
    if (parts.length === 1) return parts[0][0].toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen)
    return () => document.body.classList.remove("menu-open")
  }, [menuOpen])

  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Logo */}
        <Link to="/" className="navbar-brand" onClick={handleLinkClick}>
          🎯 Mock Practice
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
              to="/leaderboard"
              className={location.pathname === "/leaderboard" ? "active" : ""}
              onClick={handleLinkClick}
            >
              Contest
            </Link>
          </li>
          <li>
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
          </li>

          {/* Mobile Buttons */}
          {!user ? (
            <li className="mobile-buttons">
              <Link to="/login" className="btn btn-outline mobile-btn" onClick={handleLinkClick}>
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary mobile-btn" onClick={handleLinkClick}>
                Signup
              </Link>
            </li>
          ) : (
            <li className="mobile-buttons">
              <div className="profile-circle" onClick={toggleDropdown}>
                {getInitials(user.name)}
              </div>
              <div className={`profile-dropdown ${dropdownOpen ? "active" : ""}`}>
  <p>{user.name}</p>
  <Link to="/profile" onClick={handleLinkClick}>Profile</Link>
  <button onClick={handleLogout}>Logout</button>
</div>

            </li>
          )}
        </ul>

        {/* Desktop Buttons */}
        <div className="navbar-actions">
          {!user ? (
            <>
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary">
                Signup
              </Link>
            </>
          ) : (
            <div className="profile-wrapper">
              <div className="profile-circle" onClick={toggleDropdown}>
                {getInitials(user.name)}
              </div>
              {dropdownOpen && (
                <div className="profile-dropdown">
                  <p>{user.name}</p>
                  <Link to="/profile">Profile</Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && <div className="menu-overlay show" onClick={() => setMenuOpen(false)}></div>}
    </nav>
  )
}

export default Header

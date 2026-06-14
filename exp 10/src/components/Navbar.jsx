import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useBooking } from "../context/BookingContext";
import "./Navbar.css";



export default function Navbar() {
  const { user, logout } = useBooking();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);


  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">◈</span>
          <span className="brand-name">SkyBook</span>
        </Link>

        <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>Home</Link>
          <Link to="/search" className={`nav-link ${isActive("/search") ? "active" : ""}`}>Flights</Link>
          {user && (
            <Link to="/history" className={`nav-link ${isActive("/history") ? "active" : ""}`}>
              My Bookings
            </Link>
          )}
        </div>

        <div className="navbar-actions">
          {user ? (
            <div className="user-menu">
              <div className="user-avatar">{user.name?.[0]?.toUpperCase() || "U"}</div>
              <span className="user-name">{user.name}</span>
              <button onClick={handleLogout} className="btn-outline" style={{ padding: "8px 18px", fontSize: "13px" }}>
                Sign Out
              </button>
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login"><button className="btn-ghost" style={{ padding: "8px 18px", fontSize: "14px" }}>Login</button></Link>
              <Link to="/register"><button className="btn-primary" style={{ padding: "8px 18px", fontSize: "14px" }}>Register</button></Link>
            </div>
          )}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </div>
    </nav>
  );
}

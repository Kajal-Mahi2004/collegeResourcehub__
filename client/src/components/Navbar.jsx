import "./Navbar.css";
import logo from "../assets/logo.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user, role } = useSelector(state => state.auth);
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    // Clear Redux store
    dispatch(logout());
    
    // Clear localStorage completely
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    localStorage.removeItem("role"); // Clear old key if exists
    
    navigate("/");
    setShowMenu(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setShowMenu(false);
  };

  return (
    <div className="navbar">
      <div className="logo-section">
        <img src={logo} alt="logo" />
        <div>
          <h2>College Resource Hub</h2>
          <p>Rungta International Skills University</p>
        </div>
      </div>

      <div className="menu-toggle" onClick={() => setShowMenu(!showMenu)}>
        ☰
      </div>

      <div className={`nav-links ${showMenu ? "active" : ""}`}>
        {!token ? (
          <>
            <button onClick={() => handleNavigation("/")}>Home</button>
            <button onClick={() => handleNavigation("/signup")}>Signup</button>
            <button onClick={() => handleNavigation("/student-login")} className="student-link">
              👨‍🎓 Student Login
            </button>
            <button onClick={() => handleNavigation("/admin-login")} className="admin-link">
              👨‍💼 Admin Login
            </button>
          </>
        ) : (
          <>
            {role === "admin" ? (
              <>
                <button onClick={() => handleNavigation("/admin-dashboard")}>
                  📊 Admin Dashboard
                </button>
                <button onClick={() => handleNavigation("/theme")}>🎨 Theme</button>
                <div className="user-info">
                  <span>👨‍💼 {user?.name || "Admin"}</span>
                </div>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={() => handleNavigation("/student-dashboard")}>
                  📚 Student Dashboard
                </button>
                <button onClick={() => handleNavigation("/resources")}>
                  📥 Study Resources
                </button>
                <button onClick={() => handleNavigation("/theme")}>🎨 Theme</button>
                <div className="user-info">
                  <span>👨‍🎓 {user?.name || "Student"}</span>
                </div>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
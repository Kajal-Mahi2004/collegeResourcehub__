import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { setLoginSuccess } from "../redux/slices/authSlice";
import "./AdminLogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    adminKey: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/admin/login",
        {
          email: formData.email,
          password: formData.password,
          adminKey: formData.adminKey
        }
      );

      dispatch(setLoginSuccess({
        user: res.data.user,
        token: res.data.token
      }));

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userRole", res.data.user.role);
      localStorage.setItem("userName", res.data.user.name);
      localStorage.setItem("userId", res.data.user._id);

      alert("Admin login successful!");
      navigate("/admin-dashboard");

    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-container">
        {/* Left Section - Security Info */}
        <div className="admin-login-side">
          <div className="security-badge">
            <span className="badge-icon">🔐</span>
            <h2>Admin Portal</h2>
          </div>
          
          <div className="security-features">
            <h3>Secure Access</h3>
            <ul>
              <li>
                <span className="feature-icon">✓</span>
                <div>
                  <strong>Multi-Layer Authentication</strong>
                  <p>Email, Password & Admin Key</p>
                </div>
              </li>
              <li>
                <span className="feature-icon">✓</span>
                <div>
                  <strong>Encrypted Connection</strong>
                  <p>All data is SSL encrypted</p>
                </div>
              </li>
              <li>
                <span className="feature-icon">✓</span>
                <div>
                  <strong>Activity Logging</strong>
                  <p>All actions are monitored</p>
                </div>
              </li>
              <li>
                <span className="feature-icon">✓</span>
                <div>
                  <strong>Role-Based Access</strong>
                  <p>Controlled permissions</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="admin-login-form-section">
          <form className="admin-login-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <h1>Administrator Login</h1>
              <p>Restricted Access - Authorized Personnel Only</p>
            </div>

            {error && <div className="admin-error-alert">
              <span className="error-icon">⚠️</span>
              {error}
            </div>}

            <div className="form-group">
              <label htmlFor="email">Admin Email</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="admin@college.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔑</span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter admin password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="show-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="adminKey">Admin Secret Key</label>
              <div className="input-wrapper">
                <span className="input-icon">🗝️</span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="adminKey"
                  name="adminKey"
                  placeholder="Enter admin secret key"
                  value={formData.adminKey}
                  onChange={handleChange}
                  required
                />
              </div>
              <small className="key-hint">
                💡 Tip: Contact your system administrator if you forgot your secret key
              </small>
            </div>

            <button 
              type="submit" 
              className="admin-submit-btn"
              disabled={loading}
            >
              {loading ? "Verifying credentials..." : "Secure Login"}
            </button>

            <div className="admin-form-footer">
              <p>Regular user? <Link to="/login">Student Login</Link></p>
            </div>
          </form>

          {/* Security Notice */}
          <div className="security-notice">
            <span>🛡️</span>
            <p>This is a restricted area. Only authorized administrators can access this portal.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

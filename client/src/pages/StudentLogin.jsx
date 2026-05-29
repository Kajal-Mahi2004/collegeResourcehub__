import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { setLoginSuccess } from "../redux/slices/authSlice";
import api from "../services/api";
import "./StudentLogin.css";

const StudentLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      const res = await api.post(
        "/auth/login",
        {
          email: formData.email,
          password: formData.password
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

      alert("Login successful!");
      navigate("/student-dashboard");

    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-login-wrapper">
      <div className="student-login-container">
        <div className="student-login-content">
          {/* Left Section - Branding */}
          <div className="student-login-brand">
            <div className="brand-icon">
              <span>🎓</span>
            </div>
            <h2>Welcome Back!</h2>
            <p>Access your academic resources and notes</p>
          </div>

          {/* Right Section - Form */}
          <div className="student-login-form-section">
            <form className="student-login-form" onSubmit={handleSubmit}>
              <h1>Student Login</h1>

              {error && <div className="error-alert">{error}</div>}

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your.email@college.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <div className="form-footer">
                <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
              </div>

              <div className="admin-redirect">
                <p>Are you an administrator?</p>
                <Link to="/admin-login" className="admin-link">
                  Admin Login →
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;

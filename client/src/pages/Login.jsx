import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setLoginSuccess } from "../redux/slices/authSlice";
import Navbar from "../components/Navbar";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginType, setLoginType] = useState("student"); // "student" or "admin"

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    adminKey: ""
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
      let endpoint, payload;

      if (loginType === "admin") {
        // Admin login
        endpoint = "http://localhost:5000/api/auth/admin-login";
        payload = {
          email: formData.email,
          password: formData.password,
          adminKey: formData.adminKey
        };
      } else {
        // Student login
        endpoint = "http://localhost:5000/api/auth/login";
        payload = {
          email: formData.email,
          password: formData.password
        };
      }

      const res = await axios.post(endpoint, payload);

      // Save to Redux store with user and token
      dispatch(setLoginSuccess({
        user: res.data.user,
        token: res.data.token
      }));

      // Also save to localStorage for persistence
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userRole", res.data.user.role);
      localStorage.setItem("userName", res.data.user.name);
      localStorage.setItem("userId", res.data.user._id);

      alert(res.data.message);

      // Navigate based on user role
      if (res.data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/student-dashboard");
      }

    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      setError(message);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h1>Login</h1>

          {/* Login Type Selector */}
          <div className="login-type-selector">
            <button
              type="button"
              className={`type-btn ${loginType === "student" ? "active" : ""}`}
              onClick={() => {
                setLoginType("student");
                setError("");
                setFormData({ email: "", password: "", adminKey: "" });
              }}
            >
              👨‍🎓 Student Login
            </button>
            <button
              type="button"
              className={`type-btn ${loginType === "admin" ? "active" : ""}`}
              onClick={() => {
                setLoginType("admin");
                setError("");
                setFormData({ email: "", password: "", adminKey: "" });
              }}
            >
              👨‍💼 Admin Login
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* Admin Key field - only shown for admin login */}
          {loginType === "admin" && (
            <input
              type="password"
              name="adminKey"
              placeholder="Enter Admin Secret Key"
              value={formData.adminKey}
              onChange={handleChange}
              required
            />
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="signup-link">
            Don't have an account? <a href="/signup">Sign up here</a>
          </p>

        </form>
      </div>
    </>
  );
};

export default Login;
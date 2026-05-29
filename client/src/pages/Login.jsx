import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setLoginSuccess } from "../redux/slices/authSlice";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useToast } from "../components/Toast";
import "./Login.css";

const Login = ({ defaultLoginType = "student" }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginType, setLoginType] = useState(defaultLoginType); // "student" or "admin"

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    adminKey: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const showToast = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (token && role === "admin") {
      navigate("/admin-dashboard", { replace: true });
    }

    if (token && role === "student") {
      navigate("/student-dashboard", { replace: true });
    }
  }, [navigate]);

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
        endpoint = "/auth/admin/login";
        payload = {
          email: formData.email,
          password: formData.password,
          adminKey: formData.adminKey
        };
      } else {
        // Student login
        endpoint = "/auth/login";
        payload = {
          email: formData.email,
          password: formData.password
        };
      }

      const res = await api.post(endpoint, payload);

      // Save to Redux store with user and token
      dispatch(setLoginSuccess({
        user: res.data.user,
        token: res.data.token
      }));

      // Also save to localStorage for persistence
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userRole", res.data.user.role);
      localStorage.setItem("userName", res.data.user.name);
      localStorage.setItem("userId", res.data.user._id || res.data.user.id);

      showToast(res.data.message, 'success');

      // Navigate based on user role
      if (res.data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/student-dashboard");
      }

    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h1>Secure Login</h1>

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
            Student account only? <Link to="/signup">Sign up here</Link>
          </p>

        </form>
      </div>
    </>
  );
};

export default Login;
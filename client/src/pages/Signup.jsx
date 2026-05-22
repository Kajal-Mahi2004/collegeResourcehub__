import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setLoginSuccess } from "../redux/slices/authSlice";
import Navbar from "../components/Navbar";
import "./Signup.css";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [signupType, setSignupType] = useState("student"); // "student" or "admin"

  const [formData, setFormData] = useState({
    name: "",
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

      if (signupType === "admin") {
        // Admin signup
        endpoint = "http://localhost:5000/api/auth/admin-signup";
        payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          adminKey: formData.adminKey
        };
      } else {
        // Student signup
        endpoint = "http://localhost:5000/api/auth/signup";
        payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password
        };
      }

      const res = await axios.post(endpoint, payload);

      // Save to Redux store
      dispatch(setLoginSuccess({
        user: res.data.user,
        token: res.data.token
      }));

      // Also save to localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userRole", res.data.user.role);
      localStorage.setItem("userName", res.data.user.name);
      localStorage.setItem("userId", res.data.user._id);

      alert(res.data.message);
      
      // Redirect based on role
      if (res.data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/student-dashboard");
      }

    } catch (error) {
      const message = error.response?.data?.message || "Signup failed";
      setError(message);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="signup-container">
        <form className="signup-form" onSubmit={handleSubmit}>
          <h1>Sign Up</h1>

          {/* Signup Type Selector */}
          <div className="signup-type-selector">
            <button
              type="button"
              className={`type-btn ${signupType === "student" ? "active" : ""}`}
              onClick={() => {
                setSignupType("student");
                setError("");
                setFormData({ name: "", email: "", password: "", adminKey: "" });
              }}
            >
              👨‍🎓 Student Signup
            </button>
            <button
              type="button"
              className={`type-btn ${signupType === "admin" ? "active" : ""}`}
              onClick={() => {
                setSignupType("admin");
                setError("");
                setFormData({ name: "", email: "", password: "", adminKey: "" });
              }}
            >
              👨‍💼 Admin Signup
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

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

          {/* Admin Key field - only shown for admin signup */}
          {signupType === "admin" && (
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
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          <p className="login-link">
            Already have an account? <a href="/login">Login here</a>
          </p>

        </form>
      </div>
    </>
  );
};

export default Signup;
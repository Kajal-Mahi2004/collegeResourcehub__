import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setLoginSuccess } from "../redux/slices/authSlice";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useToast } from "../components/Toast";
import "./Signup.css";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
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
      const endpoint = "/auth/signup";
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };

      const res = await api.post(endpoint, payload);

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

      showToast(res.data.message, 'success');
      
      navigate("/student-dashboard");

    } catch (error) {
      const message = error.response?.data?.message || "Signup failed";
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="signup-container">
        <form className="signup-form" onSubmit={handleSubmit}>
          <h1>Student Sign Up</h1>

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

          <button type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          <p className="login-link">
            Already have an account? <Link to="/login">Login here</Link>
          </p>

        </form>
      </div>
    </>
  );
};

export default Signup;
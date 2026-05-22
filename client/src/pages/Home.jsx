import "./Home.css";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="hero-section">
        <div className="hero-left">
          <h1>
            Welcome to
            <span> College Resource Hub</span>
          </h1>

          <p>
            A smart platform for students to upload,
            search and download notes, PYQs and study materials.
          </p>

          <div className="hero-buttons">
            <button className="signup-btn" onClick={() => navigate("/signup")}>
              Get Started
            </button>

            <button className="notes-btn">
              Explore Notes
            </button>
          </div>

          <div className="login-section">
            <p className="login-text">Already have an account?</p>
            <div className="login-options">
              <button 
                className="student-login-btn"
                onClick={() => navigate("/student-login")}
              >
                👨‍🎓 Student Login
              </button>
              <button 
                className="admin-login-btn"
                onClick={() => navigate("/admin-login")}
              >
                👨‍💼 Admin Login
              </button>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="feature-card">
            📚 Notes Upload
          </div>

          <div className="feature-card">
            📄 PDF Download
          </div>

          <div className="feature-card">
            🔍 Search Subjects
          </div>

          <div className="feature-card">
            ❤️ Like & Comment
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
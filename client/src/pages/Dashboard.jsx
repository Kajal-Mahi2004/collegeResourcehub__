import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import "./Dashboard.css";

const Dashboard = () => {

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("token");

    navigate("/login");
  };

  return (

    <>

      <Navbar />

      <div className="dashboard-container">

        <div className="dashboard-card">

          <h1>Dashboard</h1>

          <p>
            Welcome to College Resource Hub 🎉
          </p>

          <button onClick={handleLogout}>
            Logout
          </button>

        </div>

      </div>

    </>
  );
};

export default Dashboard;
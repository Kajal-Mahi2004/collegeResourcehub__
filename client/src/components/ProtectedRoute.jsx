import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If admin-only route but user is not admin, redirect to student dashboard
  if (adminOnly && userRole !== "admin") {
    return <Navigate to="/student-dashboard" />;
  }

  return children;
};

export default ProtectedRoute;
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import StudentLogin from "./pages/StudentLogin";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import UploadNotes from "./pages/UploadNotes";
import Notes from "./pages/Notes";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import StudentResources from "./pages/StudentResources";
import Theme from "./pages/Theme";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/login" element={<StudentLogin />} />

        <Route path="/student-login" element={<StudentLogin />} />

        <Route path="/admin-login" element={<AdminLogin />} />

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/upload" 
          element={
            <ProtectedRoute>
              <UploadNotes />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/notes" 
          element={
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          } 
        />

        <Route
          path="/resources"
          element={
            <ProtectedRoute>
              <StudentResources />
            </ProtectedRoute>
          }
        />

        <Route
          path="/theme"
          element={
            <ProtectedRoute>
              <Theme />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
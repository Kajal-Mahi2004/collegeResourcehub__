import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UploadNotes from "./pages/UploadNotes";
import Notes from "./pages/Notes";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Theme from "./pages/Theme";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/login" element={<Login defaultLoginType="student" />} />

        <Route path="/student-login" element={<Login defaultLoginType="student" />} />

        <Route path="/admin-login" element={<Login defaultLoginType="admin" />} />

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

        {/* <Route 
          path="/upload" 
          element={
            <ProtectedRoute>
              <UploadNotes />
            </ProtectedRoute>
          } 
        /> */}

        {/* <Route 
          path="/notes" 
          element={
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          } 
        /> */}

        <Route
          path="/resources"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* <Route
          path="/theme"
          element={
            <ProtectedRoute>
              <Theme />
            </ProtectedRoute>
          }
        /> */}

      </Routes>

    </BrowserRouter>
  );
}

export default App;
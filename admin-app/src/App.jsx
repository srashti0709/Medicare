
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import DoctorProtectedRoute from "./DoctorProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorProfile from "./pages/DoctorProfile";
import DoctorSchedule from "./pages/DoctorSchedule";
import AdminProfile from "./pages/AdminProfile";
import DiabetesPrediction from "./pages/DiabetesPrediction";
import AIRiskAssessment from "./pages/AIRiskAssessment";
import KidneyDiseaseRisk from "./pages/KidneyDiseaseRisk";
import ChangeDoctorPassword from "./pages/ChangeDoctorPassword";

const PageTitle = () => {
  const location = useLocation();

  useEffect(() => {
    let user = {};

    try {
      user = JSON.parse(localStorage.getItem("adminUser") || "{}");
    } catch (error) {
      user = {};
    }

    const path = location.pathname;

    if (path === "/") {
      document.title = "Medicare | Login";
    } else if (path === "/change-doctor-password") {
      document.title = "Medicare | Change Password";
    } else if (user.role === "admin") {
      document.title = "Medicare | Admin Panel";
    } else if (user.role === "doctor") {
      document.title = "Medicare | Doctor Portal";
    } else {
      document.title = "Medicare | Login";
    }
  }, [location.pathname]);

  return null;
};

function App() {
  return (
    <BrowserRouter>
      <PageTitle />

      <Routes>
        <Route path="/" element={<Login />} />

        {/* Admin Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-profile"
          element={
            <ProtectedRoute>
              <AdminProfile />
            </ProtectedRoute>
          }
        />

        {/* Doctor Password Change Route */}
        <Route
          path="/change-doctor-password"
          element={
            <DoctorProtectedRoute allowPasswordChange>
              <ChangeDoctorPassword />
            </DoctorProtectedRoute>
          }
        />

        {/* Doctor Routes */}
        <Route
          path="/doctor-dashboard"
          element={
            <DoctorProtectedRoute>
              <DoctorDashboard />
            </DoctorProtectedRoute>
          }
        />

        <Route
          path="/doctor-profile"
          element={
            <DoctorProtectedRoute>
              <DoctorProfile />
            </DoctorProtectedRoute>
          }
        />

        <Route
          path="/doctor-schedule"
          element={
            <DoctorProtectedRoute>
              <DoctorSchedule />
            </DoctorProtectedRoute>
          }
        />

        <Route
          path="/diabetes-prediction"
          element={
            <DoctorProtectedRoute>
              <DiabetesPrediction />
            </DoctorProtectedRoute>
          }
        />

        <Route
          path="/ai-risk-assessment"
          element={
            <DoctorProtectedRoute>
              <AIRiskAssessment />
            </DoctorProtectedRoute>
          }
        />

        <Route
          path="/kidney-disease-risk"
          element={
            <DoctorProtectedRoute>
              <KidneyDiseaseRisk />
            </DoctorProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

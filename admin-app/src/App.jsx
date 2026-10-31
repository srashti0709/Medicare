import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorProtectedRoute from "./DoctorProtectedRoute";
import DoctorProfile from "./pages/DoctorProfile";
import DoctorSchedule from "./pages/DoctorSchedule";
import AdminProfile from "./pages/AdminProfile";
import DiabetesPrediction from "./pages/DiabetesPrediction";
import AIRiskAssessment from "./pages/AIRiskAssessment";
import KidneyDiseaseRisk from "./pages/KidneyDiseaseRisk";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
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
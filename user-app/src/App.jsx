
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import DoctorDetails from "./pages/DoctorDetails";
import Services from "./pages/Services";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookAppointment from "./pages/BookAppointment";
import MyAppointments from "./pages/MyAppointments";
import Profile from "./pages/Profile";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "./pages/NotFound";
import HealthReportAnalyzer from "./pages/HealthReportAnalyzer";
import AIAssistant from "./pages/AIAssistant";
import HealthTimeline from "./pages/HealthTimeline";

import AIFloatingChat from "./components/AIFloatingChat";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:id" element={<DoctorDetails />} />
        <Route path="/services" element={<Services />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/book-appointment"
          element={
            <ProtectedRoute>
              <BookAppointment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-appointments"
          element={
            <ProtectedRoute>
              <MyAppointments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/health-timeline"
          element={
            <ProtectedRoute>
              <HealthTimeline />
            </ProtectedRoute>
          }
        />

        <Route
          path="/health-report-analyzer"
          element={<HealthReportAnalyzer />}
        />

        <Route
          path="/ai-assistant"
          element={<AIAssistant />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <AIFloatingChat />
    </BrowserRouter>
  );
}

export default App;

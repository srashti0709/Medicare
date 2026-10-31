import { Navigate } from "react-router-dom";

const DoctorProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");

  const user = JSON.parse(
    localStorage.getItem("adminUser") || "{}"
  );

  if (!token || user.role !== "doctor") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default DoctorProtectedRoute;
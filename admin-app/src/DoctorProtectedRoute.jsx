
import { Navigate } from "react-router-dom";

const DoctorProtectedRoute = ({
  children,
  allowPasswordChange = false,
}) => {
  const token = localStorage.getItem("adminToken");

  const user = JSON.parse(
    localStorage.getItem("adminUser") || "{}"
  );

  if (!token || user.role !== "doctor") {
    return <Navigate to="/" replace />;
  }

  // Doctors must change their temporary password
  // before accessing normal dashboard pages.
  if (user.mustChangePassword && !allowPasswordChange) {
    return <Navigate to="/change-doctor-password" replace />;
  }

  // Allow access to the password-change page itself.
  if (!user.mustChangePassword && allowPasswordChange) {
    return <Navigate to="/doctor-dashboard" replace />;
  }

  return children;
};

export default DoctorProtectedRoute;

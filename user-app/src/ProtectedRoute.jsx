import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("userToken");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user || user.role !== "patient") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
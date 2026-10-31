import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("adminToken");
    const adminUser = JSON.parse(
        localStorage.getItem("adminUser") || "{}"
    );

    if (!token || adminUser.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
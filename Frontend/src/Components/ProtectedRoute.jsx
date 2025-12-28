import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element: Component }) => {
    const isAuthenticated = localStorage.getItem("token");
    return isAuthenticated ? (
        <Component />
    ) : (
        <Navigate to="/landing" replace />
    );
};

export default ProtectedRoute;

import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API_URL from "../api";

const ProtectedRoute = ({ element: Component }) => {
    const [checking, setChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        fetch(`${API_URL}/api/getUserData`, {
            credentials: "include",
        })
            .then((res) => {
                if (res.ok) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            })
            .catch(() => setIsAuthenticated(false))
            .finally(() => setChecking(false));
    }, []);

    // Prevent redirect flicker
    if (checking) return null;

    return isAuthenticated ? (
        <Component />
    ) : (
        <Navigate to="/landing" replace />
    );
};

export default ProtectedRoute;

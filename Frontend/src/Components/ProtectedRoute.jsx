import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API_URL from "../api";

const ProtectedRoute = ({ element: Component }) => {
    const [checking, setChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        let mounted = true;

        fetch(`${API_URL}/api/getUserData`, {
            credentials: "include",
        })
            .then((res) => {
                if (mounted) setIsAuthenticated(res.ok);
            })
            .catch(() => {
                if (mounted) setIsAuthenticated(false);
            })
            .finally(() => {
                if (mounted) setChecking(false);
            });

        return () => {
            mounted = false;
        };
    }, []);

    if (checking) return null;

    if (!Component) return <Navigate to="/" replace />;

    return isAuthenticated ? <Component /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;

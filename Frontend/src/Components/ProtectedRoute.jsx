import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import API_URL from "../api";

const ProtectedRoute = () => {
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch(`${API_URL}/api/getUserData`, {
                    credentials: "include",
                });

                if (res.ok) {
                    setIsAuth(true);
                } else {
                    setIsAuth(false);
                }
            } catch {
                setIsAuth(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) return null;

    if (!isAuth) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;

import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api";

const IsAuthN = () => {
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await api.get("/api/getUserData");
                setIsAuth(true);
            } catch {
                setIsAuth(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) return null;

    return isAuth ? (
        <Navigate to="/explore" replace />
    ) : (
        <Navigate to="/landing" replace />
    );
};

export default IsAuthN;

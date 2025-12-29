import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API_URL from "../api";

const IsAuthN = () => {
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch(`${API_URL}/api/getUserData`, {
                    credentials: "include",
                });

                if (res.ok) setIsAuth(true);
            } catch { }
            finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) return null;

    return isAuth
        ? <Navigate to="/explore" replace />
        : <Navigate to="/login" replace />;
};

export default IsAuthN;

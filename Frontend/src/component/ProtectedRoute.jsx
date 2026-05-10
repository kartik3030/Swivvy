import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";


const ProtectedRoute = () => {
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/me`,
                    {
                        credentials: "include",
                    }
                );

                if (!res.ok) {
                    throw new Error("Unauthorized");
                }

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

    if (!isAuth) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;

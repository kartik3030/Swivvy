import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [isAuth, setIsAuth] = useState<boolean>(false);

    useEffect(() => {
        const checkAuth = async (): Promise<void> => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/me`, {
                    credentials: "include",
                });

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
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const IsAuthN = () => {
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

    return isAuth ? (
        <Navigate to="/explore" replace />
    ) : (
        <Navigate to="/landing" replace />
    );
};

export default IsAuthN;
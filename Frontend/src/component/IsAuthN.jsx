import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";


const IsAuthN = () => {
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

    return isAuth ? (
        <Navigate to="/explore" replace />
    ) : (
        <Navigate to="/landing" replace />
    );
};

export default IsAuthN;

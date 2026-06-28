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

    if (loading) return (
        <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
      @keyframes pulse { 0%,100%{opacity:0.3} 50%{opacity:0.8} }
    `}</style>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '5rem', letterSpacing: '0.02em', color: '#7f1d1d', animation: 'pulse 2s ease-in-out infinite' }}>
                SWIVVY
            </span>
        </div>
    )

    if (!isAuth) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
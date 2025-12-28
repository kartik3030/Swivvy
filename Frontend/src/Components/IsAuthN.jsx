// IsAuthN.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Landing from "../Pages/Landing.jsx";
import API_URL from "../api";

const IsAuthN = () => {
    const [checking, setChecking] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        fetch(`${API_URL}/api/getUserData`, {
            credentials: "include",
        })
            .then((res) => {
                if (res.ok) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            })
            .catch(() => setIsLoggedIn(false))
            .finally(() => setChecking(false));
    }, []);

    // Prevent flicker while checking auth
    if (checking) return null;

    // If logged in → redirect to /explore
    if (isLoggedIn) {
        return <Navigate to="/explore" replace />;
    }

    return <Landing />;
};

export default IsAuthN;

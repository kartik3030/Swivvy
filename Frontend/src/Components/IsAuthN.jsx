// IsAuthN.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import Landing from "../Pages/Landing.jsx";

const IsAuthN = () => {
    const isLoggedIn = localStorage.getItem("token");

    // If logged in → redirect to /explore
    if (isLoggedIn) {
        return <Navigate to="/explore" replace />;
    }

    return <Landing />;
};

export default IsAuthN;

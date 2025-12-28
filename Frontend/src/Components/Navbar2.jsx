import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Navbar2 = () => {
    const [backendData, setBackendData] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) fetchDataFromBackend(token);
    }, []);

    async function fetchDataFromBackend(token) {
        try {
            const res = await fetch("http://localhost:3000/api/getUserData", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to fetch user data");

            const data = await res.json();
            setBackendData(data);

        } catch (err) {
            console.error("Error fetching data:", err);
        }
    }

    return (
        <nav className="p-2 w-full sm:w-150 rounded-[40px] border-white/50 bg-white/10 backdrop-blur-md shadow-lg mt-1">
            <ul className="flex justify-between items-center ml-5 mr-5">
                <li className='font-extrabold  sm:text-lg  text-red-900'>
                    <Link to={"/explore"}>
                        Swivvy
                    </Link>
                </li>
                <li>
                    <Link to="/profile">
                        <img
                            src={
                                backendData?.profilePhoto
                            }
                            alt="profile"
                            className="max-h-7  min-h-7 min-w-8  max-w-8  rounded-[100%]"
                        />
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar2;

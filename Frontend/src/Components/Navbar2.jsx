import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../api";
const resolveImage = (path) => {
    if (!path) {
        return "https://i.pinimg.com/474x/3d/8d/b1/3d8db18cc50c15523a13908a593a480c.jpg";
    }

    // already absolute
    if (path.startsWith("http")) return path;

    // backend-relative upload
    if (path.startsWith("/uploads")) return `${API_URL}${path}`;

    return "https://i.pinimg.com/474x/3d/8d/b1/3d8db18cc50c15523a13908a593a480c.jpg";
};

const Navbar2 = () => {
    const [backendData, setBackendData] = useState(null);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const res = await fetch(`${API_URL}/api/getUserData`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!res.ok) return;

                const data = await res.json();
                if (mounted) setBackendData(data);
            } catch (err) {
                console.error("Navbar fetch error:", err);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    const profileSrc = resolveImage(backendData?.profilePhoto);

    return (
        <nav className="p-2 w-full sm:w-150 rounded-[40px] border-white/50 bg-white/10 backdrop-blur-md shadow-lg mt-1">
            <ul className="flex justify-between items-center ml-5 mr-5">
                <li className="font-extrabold sm:text-lg text-red-900">
                    <Link to="/explore">Swivvy</Link>
                </li>

                <li>
                    <Link to="/profile">
                        <img
                            src={profileSrc}
                            alt="profile"
                            className="max-h-7 min-h-7 min-w-8 max-w-8 rounded-full object-cover"
                        />
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar2;

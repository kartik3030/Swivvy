import React, { useEffect, useState } from "react";
import Navbar2 from "../Components/Navbar2";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProfilePage = () => {
    const [backendData, setBackendData] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decoded.exp < currentTime) {
                handleLogout();
                return;
            }

            fetchUserData(token);
        } catch (err) {
            console.error("Invalid token:", err);
            localStorage.removeItem("token");
            navigate("/login");
        }
    }, [navigate]);

    async function fetchUserData(token) {
        try {
            const res = await fetch("http://localhost:3000/api/getUserData", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to fetch user data");

            const data = await res.json();
            setBackendData(data);
        } catch (err) {
            console.error(err);
        }
    }

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:3000/api/logout", {
                credentials: "include",
            });
        } catch (err) {
            console.warn("Logout failed:", err);
        } finally {
            localStorage.removeItem("token");
            navigate("/login");
        }
    };

    const handleConfirmDelete = async () => {
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(
                "http://localhost:3000/api/deleteAccount",
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    credentials: "include",
                }
            );

            if (!res.ok) throw new Error("Delete failed");

            localStorage.removeItem("token");
            navigate("/");
        } catch (err) {
            console.error(err);
        } finally {
            setShowConfirm(false);
        }
    };

    return (
        <div className="bg-black text-white min-h-screen">
            <div className="flex justify-center">
                <Navbar2 />
            </div>

            <main>
                {/* Header */}
                <div className="flex justify-between sm:justify-center sm:gap-x-150 px-5 mt-5">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
                        Profile Settings
                    </h1>

                    <Link to="/editProfile">
                        <span className="material-symbols-outlined cursor-pointer">
                            edit
                        </span>
                    </Link>
                </div>

                {/* Profile Card */}
                <div className="flex justify-center mt-3">
                    <div className="w-200 flex gap-6 p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
                        <img
                            src={backendData?.profilePhoto}
                            alt="profile"
                            className="w-40 h-50 rounded-lg object-cover"
                            onError={(e) =>
                            (e.currentTarget.src =
                                "https://i.pinimg.com/474x/3d/8d/b1/3d8db18cc50c15523a13908a593a480c.jpg")
                            }
                        />

                        <div>
                            <h1 className="text-3xl font-bold">
                                {backendData?.FName}
                            </h1>

                            <p className="text-gray-400 flex items-center">
                                <span className="material-symbols-outlined">
                                    location_on
                                </span>
                                {backendData?.country}
                            </p>

                            <p className="mt-2">{backendData?.bio}</p>

                            <p className="mt-5 font-bold text-red-900">
                                Top Skills
                            </p>

                            <div className="flex gap-2 mt-2 flex-wrap">
                                {backendData?.skills?.slice(0, 6).map((s, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 rounded-full border border-white/20 text-sm bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent font-bold"
                                    >
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Settings */}
                <div className="flex justify-center mt-5">
                    <div className="w-200 p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
                        <p
                            className="cursor-pointer text-red-900"
                            onClick={() => setShowConfirm(true)}
                        >
                            Delete Account
                        </p>

                        <p
                            className="cursor-pointer mt-4"
                            onClick={handleLogout}
                        >
                            Logout
                        </p>
                    </div>
                </div>
            </main>

            {/* Delete Modal */}
            {showConfirm && (
                <div
                    className="fixed inset-0 bg-black/60 flex items-center justify-center"
                    onClick={() => setShowConfirm(false)}
                >
                    <div
                        className="bg-black/80 p-5 rounded-lg w-72"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p className="mb-4 text-center">
                            Delete your account permanently?
                        </p>

                        <div className="flex justify-between">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-4 py-2 bg-red-700 rounded-full"
                            >
                                No
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-700 rounded-full"
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;

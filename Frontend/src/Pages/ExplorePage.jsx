import React, { useEffect, useState } from "react";
import Aside from "../Components/Aside";
import Navbar2 from "../Components/Navbar2";
import SwipeCard from "../Components/SwipeCard";
import Chat from "../Components/Chat";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const ExplorePage = () => {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const [matchedUser, setMatchedUser] = useState(null);

    /* ================= FETCH USERS ================= */

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const res = await fetch("/api/getDatabaseData", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    console.error("Failed to fetch users");
                    return;
                }

                const data = await res.json();
                setUsers(data);
                setCurrentIndex(0);
            } catch (err) {
                console.error("Fetch users error:", err);
            }
        };

        fetchUsers();
    }, []);

    /* ================= AUTO LOGOUT ================= */

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;

        if (decoded.exp < now) {
            localStorage.removeItem("token");
            navigate("/landing");
        }
    }, [navigate]);

    const currentUser = users[currentIndex];

    /* ================= RIGHT SWIPE ================= */

    const handleRightSwipe = async () => {
        if (!currentUser || isSwiping) return;

        setIsSwiping(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await fetch("/api/rightSwipe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userOnFeed: currentUser._id,
                }),
            });

            if (!res.ok) {
                console.error("Right swipe failed");
                return;
            }

            const data = await res.json();

            if (data.match) {
                setMatchedUser(currentUser);
            } else {
                moveToNext();
            }
        } catch (err) {
            console.error("Right swipe error:", err);
        } finally {
            setIsSwiping(false);
        }
    };

    /* ================= LEFT SWIPE ================= */

    const handleLeftSwipe = async () => {
        if (!currentUser || isSwiping) return;

        setIsSwiping(true);

        try {
            const token = localStorage.getItem("token");

            await fetch("/api/leftSwipe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userOnFeed: currentUser._id,
                }),
            });

            moveToNext();
        } catch (err) {
            console.error("Left swipe error:", err);
        } finally {
            setIsSwiping(false);
        }
    };

    /* ================= HELPERS ================= */

    const moveToNext = () => {
        setCurrentIndex((prev) => prev + 1);
    };

    const closeMatch = () => {
        setMatchedUser(null);
        moveToNext();
    };



    /* ================= RENDER ================= */

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="flex justify-center">
                <Navbar2 />
            </div>

            <div className="sm:flex justify-evenly">
                <div className="mt-5 hidden sm:flex">
                    <Aside />
                </div>

                <main>
                    <div className="flex justify-center">
                        <SwipeCard
                            user={currentUser}
                            onAccept={handleRightSwipe}
                            onReject={handleLeftSwipe}
                            matchedUser={matchedUser}
                            closeMatch={closeMatch}
                        />
                    </div>

                    {/* Bottom Buttons */}
                    <div className="flex justify-center mt-3">
                        <div className="flex gap-5 items-center">
                            {/* Reject */}
                            <button
                                onClick={handleLeftSwipe}
                                className="flex items-center justify-center w-20 h-20 p-3 border-2 border-red-900 rounded-full"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 -960 960 960"
                                    width="60"
                                    height="60"
                                    fill="#7F1D1D"
                                >
                                    <path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" />
                                </svg>
                            </button>

                            {/* Accept */}
                            <button
                                onClick={handleRightSwipe}
                                className="flex items-center justify-center w-20 h-20 p-3 border-2 border-green-700 rounded-full"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 -960 960 960"
                                    width="60"
                                    height="60"
                                    fill="#15803D"
                                >
                                    <path d="M378-246 154-470l43-43 181 181 384-384 43 43-427 427Z" />
                                </svg>
                            </button>

                            {/* Chat (Mobile) */}
                            <button
                                onClick={() => navigate("/chatPage")}
                                className="sm:hidden flex items-center justify-center w-12 h-12 p-3 border-2 border-yellow-400 rounded-full"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 -960 960 960"
                                    width="24"
                                    height="24"
                                    fill="#FACC15"
                                >
                                    <path d="M240-400h320v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </main>

                <div className="mt-5 hidden sm:block">
                    <Chat />
                </div>
            </div>
        </div>
    );
};

export default ExplorePage;

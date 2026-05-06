import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Aside from "../Components/Aside";
import Navbar2 from "../Components/Navbar2";
import SwipeCard from "../Components/SwipeCard";
import Chat from "../Components/Chat";
import { BASE_URL as API_URL } from "../api";

const ExplorePage = () => {
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const [matchedUser, setMatchedUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const swipeLock = useRef(false);
    const navigate = useNavigate();

    /* ================= AUTH CHECK ================= */

    useEffect(() => {
        let cancelled = false;

        const checkAuth = async () => {
            try {
                const res = await fetch(`${API_URL}/api/getUserData`, {
                    credentials: "include",
                });

                if (res.status === 401) {
                    if (!cancelled) {
                        setUser(null);
                        setLoading(false);
                        navigate("/");
                    }
                    return;
                }

                const data = await res.json();

                if (!cancelled) {
                    setUser(data);
                    setLoading(false);
                }
            } catch (err) {
                console.error("Auth error:", err);
                if (!cancelled) {
                    setLoading(false);
                    navigate("/");
                }
            }
        };

        checkAuth();

        return () => {
            cancelled = true;
        };
    }, [navigate]);

    /* ================= FETCH USERS ================= */

    useEffect(() => {
        if (!user) return;

        let cancelled = false;

        const fetchUsers = async () => {
            try {
                const res = await fetch(`${API_URL}/api/getDatabaseData`, {
                    credentials: "include",
                });

                if (!res.ok) throw new Error("Failed to fetch users");

                const data = await res.json();

                if (!cancelled) {
                    setUsers(Array.isArray(data) ? data : []);
                    setCurrentIndex(0);
                }
            } catch (err) {
                console.error("Fetch users error:", err);
            }
        };

        fetchUsers();

        return () => {
            cancelled = true;
        };
    }, [user]);

    const currentUser =
        users.length > 0 && currentIndex < users.length
            ? users[currentIndex]
            : null;

    /* ================= HELPERS ================= */

    const moveToNext = () => {
        setCurrentIndex((prev) => {
            if (prev + 1 >= users.length) return prev;
            return prev + 1;
        });
    };

    const closeMatch = () => {
        setMatchedUser(null);
        moveToNext();
    };

    /* ================= RIGHT SWIPE ================= */

    const handleRightSwipe = async () => {
        if (!currentUser || swipeLock.current) return;

        swipeLock.current = true;
        setIsSwiping(true);

        try {
            const res = await fetch(`${API_URL}/api/rightSwipe`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userOnFeed: currentUser._id }),
            });

            if (!res.ok) throw new Error("Right swipe failed");

            const data = await res.json();

            if (data?.match) {
                setMatchedUser(currentUser);
            } else {
                moveToNext();
            }
        } catch (err) {
            console.error("Right swipe error:", err);
        } finally {
            swipeLock.current = false;
            setIsSwiping(false);
        }
    };

    /* ================= LEFT SWIPE ================= */

    const handleLeftSwipe = async () => {
        if (!currentUser || swipeLock.current) return;

        swipeLock.current = true;
        setIsSwiping(true);

        try {
            const res = await fetch(`${API_URL}/api/leftSwipe`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userOnFeed: currentUser._id }),
            });

            if (!res.ok) throw new Error("Left swipe failed");

            moveToNext();
        } catch (err) {
            console.error("Left swipe error:", err);
        } finally {
            swipeLock.current = false;
            setIsSwiping(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <span className="text-sm text-gray-400">Loading...</span>
            </div>
        );
    }

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

                    <div className="flex justify-center mt-3">
                        <div className="flex gap-5 items-center">
                            <button
                                onClick={handleLeftSwipe}
                                disabled={!currentUser || isSwiping}
                                className="flex items-center justify-center w-20 h-20 p-3 border-2 border-red-900 rounded-full"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="60" height="60" fill="#7F1D1D">
                                    <path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" />
                                </svg>
                            </button>

                            <button
                                onClick={handleRightSwipe}
                                disabled={!currentUser || isSwiping}
                                className="flex items-center justify-center w-20 h-20 p-3 border-2 border-green-700 rounded-full"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="60" height="60" fill="#15803D">
                                    <path d="M378-246 154-470l43-43 181 181 384-384 43 43-427 427Z" />
                                </svg>
                            </button>

                            <button
                                onClick={() => window.location.assign("/chatPage")}
                                className="sm:hidden flex items-center justify-center w-12 h-12 p-3 border-2 border-yellow-400 rounded-full"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24" height="24" fill="#FACC15">
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

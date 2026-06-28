import React, { useEffect, useRef, useState } from "react";
import Navbar2 from "../component/Navbar2";
import { Link, useNavigate } from "react-router-dom";

interface BackendUser {
    _id?: string;
    FName?: string;
    LName?: string;
    email?: string;
    bio?: string;
    country?: string;
    profilePhoto?: string;
    skills?: string[];
}

interface DeleteResponse {
    error?: string;
}

/* ================= IMAGE RESOLVER ================= */

const FALLBACK_IMG =
    "https://i.pinimg.com/474x/3d/8d/b1/3d8db18cc50c15523a13908a593a480c.jpg";

const resolveImage = (path?: string): string => {
    return path || FALLBACK_IMG;
};

const ProfilePage = (): React.ReactElement | null => {
    const [backendData, setBackendData] = useState<BackendUser | null>(null);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const navigate = useNavigate();
    const actionLock = useRef<boolean>(false);

    /* ================= AUTH + FETCH USER ================= */

    useEffect(() => {
        const fetchUser = async (): Promise<void> => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/me`,
                    { credentials: "include" }
                );
                if (!res.ok) throw new Error("Unauthorized");
                const data: BackendUser = await res.json();
                setBackendData(data);
                setLoading(false);
            } catch {
                setLoading(false);
                navigate("/login");
            }
        };
        fetchUser();
    }, [navigate]);

    /* ================= LOGOUT ================= */

    const handleLogout = async (): Promise<void> => {
        if (actionLock.current) return;
        actionLock.current = true;

        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/logout`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
        } catch (err: unknown) {
            console.error("Logout error:", err);
        } finally {
            actionLock.current = false;
            navigate("/login");
        }
    };

    /* ================= DELETE ACCOUNT ================= */

    const handleConfirmDelete = async (): Promise<void> => {
        if (actionLock.current) return;

        actionLock.current = true;

        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/deleteAccount`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            const data: DeleteResponse = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Delete failed");
            }

            navigate("/signup");
        } catch (err: unknown) {
            console.error("Delete account error:", err);
        } finally {
            actionLock.current = false;
            setShowConfirm(false);
        }
    };

    /* ================= LOADING ================= */

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

    if (!backendData) return null;

    /* ================= RENDER ================= */

    return (
        <div className="bg-black text-white min-h-screen pb-16">

            {/* Navbar */}
            <div className="flex justify-center mb-15">
                <Navbar2 />
            </div>

            <main className="max-w-2xl mx-auto px-5">

                {/* ── Profile Card ── */}
                <div
                    className="flex gap-5 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md"
                    style={{ animation: "fadeUp .45s .1s cubic-bezier(.22,.68,0,1.2) both" }}
                >
                    {/* Avatar with floating edit icon */}
                    <div className="relative flex-shrink-0">
                        <img
                            src={resolveImage(backendData.profilePhoto)}
                            alt="Profile preview"
                            className="w-30 h-[200px] rounded-[14px] object-cover block"
                        />
                        {/* Gradient overlay on avatar */}
                        <div className="absolute inset-0 rounded-[14px] bg-gradient-to-b from-transparent via-transparent to-black/50 pointer-events-none" />


                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-bold truncate mb-1">
                            {backendData.FName}
                        </h2>

                        <p className="text-gray-400 flex items-center gap-1 text-sm mb-3">
                            <span className="material-symbols-outlined text-[16px] text-orange-500">location_on</span>
                            {backendData.country}
                        </p>

                        <p className="text-sm text-gray-300 leading-relaxed mb-4">
                            {backendData.bio}
                        </p>


                    </div>
                </div>

                {/* ── Account Settings ── */}
                <div
                    className="mt-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden"
                    style={{ animation: "fadeUp .45s .22s cubic-bezier(.22,.68,0,1.2) both" }}
                >

                    {/* Edit Profile row */}
                    <Link
                        to="/editProfile"
                        className="
                            flex items-center gap-4 px-5 py-4
                            border-b border-white/8
                            transition-colors duration-150
                            hover:bg-white/6 active:bg-white/10
                            no-underline
                        "
                    >
                        <div className="w-9 h-9 rounded-[10px] bg-white/8 flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-[20px] text-gray-300">manage_accounts</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-[15px] text-gray-100 m-0">Edit Profile</p>
                            <p className="text-[12px] text-gray-500 m-0 mt-0.5">Update photo, bio & details</p>
                        </div>
                        <span className="material-symbols-outlined text-[18px] text-gray-600">chevron_right</span>
                    </Link>

                    {/* Logout row */}
                    <button
                        onClick={handleLogout}
                        className="
                            w-full flex items-center gap-4 px-5 py-4
                            border-b border-white/8
                            transition-colors duration-150
                            hover:bg-white/6 active:bg-white/10
                            text-left bg-transparent
                        "
                    >
                        <div className="w-9 h-9 rounded-[10px] bg-white/8 flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-[20px] text-gray-300">logout</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-[15px] text-gray-100 m-0">Logout</p>
                            <p className="text-[12px] text-gray-500 m-0 mt-0.5">Sign out of your account</p>
                        </div>
                        <span className="material-symbols-outlined text-[18px] text-gray-600">chevron_right</span>
                    </button>

                    {/* Delete Account row */}
                    <button
                        onClick={() => setShowConfirm(true)}
                        className="
                            w-full flex items-center gap-4 px-5 py-4
                            transition-colors duration-150
                            hover:bg-red-950/30 active:bg-red-900/30
                            text-left bg-transparent
                        "
                    >
                        <div className="w-9 h-9 rounded-[10px] bg-red-900/25 flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-[20px] text-red-400">delete</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-[15px] text-red-400 m-0">Delete Account</p>
                            <p className="text-[12px] text-gray-500 m-0 mt-0.5">This action is permanent</p>
                        </div>
                        <span className="material-symbols-outlined text-[18px] text-gray-600">chevron_right</span>
                    </button>
                </div>
            </main>

            {/* ── Delete Confirm Modal ── */}
            {showConfirm && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
                    style={{ animation: "fadeIn .2s both" }}
                    onClick={() => setShowConfirm(false)}
                >
                    <div
                        className="bg-[#111] border border-white/12 rounded-2xl p-7 w-[300px]"
                        style={{ animation: "scaleIn .25s cubic-bezier(.22,.68,0,1.2) both" }}
                        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                    >
                        <h3 className="text-[17px] font-semibold text-center mb-1">
                            Delete Account?
                        </h3>
                        <p className="text-sm text-gray-400 text-center mb-6">
                            This will permanently remove your account and all data. This can't be undone.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="
                                    flex-1 py-3 rounded-full text-sm font-semibold
                                    bg-white/10 text-gray-200
                                    hover:bg-white/15 transition-colors duration-150
                                    active:scale-95
                                "
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="
                                    flex-1 py-3 rounded-full text-sm font-semibold
                                    bg-gradient-to-r from-orange-700 to-orange-500 text-white
                                    hover:opacity-88 transition-opacity duration-150
                                    active:scale-95
                                "
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Keyframe Styles ── */}
            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(18px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(.92); }
                    to   { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default ProfilePage;
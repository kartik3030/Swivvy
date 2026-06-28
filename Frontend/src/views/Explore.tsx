import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Aside from "../component/Aside";
import Navbar2 from "../component/Navbar2";
import SwipeCard from "../component/SwipeCard";
import Chat from "../component/Chat";

/* ─── Global styles injected once ─── */
const injectStyles = () => {
    if (document.getElementById("explore-global-styles")) return;
    const s = document.createElement("style");
    s.id = "explore-global-styles";
    s.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        /* ── Loading screen ── */
        .ep-loader {
            min-height: 100vh;
            background: #000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 18px;
        }
        .ep-loader-ring {
            width: 44px; height: 44px;
            border-radius: 50%;
            border: 2px solid rgba(255,255,255,0.07);
            border-top-color: rgba(255,255,255,0.5);
            animation: ep-spin 0.85s linear infinite;
        }
        .ep-loader-label {
            font-family: 'DM Sans', sans-serif;
            font-size: 12px;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: rgba(255,255,255,0.25);
        }

        /* ── Root shell ── */
        .ep-root {
            min-height: 100vh;
            background: #000;
            color: #fff;
            font-family: 'DM Sans', sans-serif;
        }

        /* ── Sticky nav ── */
        .ep-nav-wrap {
            position: sticky;
            top: 0;
            z-index: 40;
            display: flex;
            justify-content: center;
            background: rgba(0,0,0,0.8);
            backdrop-filter: blur(18px);
            -webkit-backdrop-filter: blur(18px);
            border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        /* ── Three-column layout ── */
        .ep-columns {
            display: flex;
            justify-content: space-evenly;
            align-items: flex-start;
            padding: 32px 16px 48px;
            gap: 24px;
        }
        .ep-aside { display: none; }
        @media (min-width: 640px) { .ep-aside { display: flex; margin-top: 8px; } }
        .ep-chat  { display: none; }
        @media (min-width: 640px) { .ep-chat  { display: block; margin-top: 8px; } }

        /* ── Centre column ── */
        .ep-main {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 28px;
            animation: ep-fadeUp 0.5s ease both;
        }

        /* ── Card stage ── */
        .ep-stage {
            position: relative;
            width: 340px;
            max-width: calc(100vw - 32px);
        }

        /* directional hint overlays */
        .ep-hint {
            position: absolute;
            inset: 0;
            border-radius: 20px;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.12s ease;
            z-index: 5;
        }
        .ep-hint-left  { background: rgba(127,29,29,0.22);  border: 1.5px solid rgba(239,68,68,0.4); }
        .ep-hint-right { background: rgba(21,128,61,0.18);  border: 1.5px solid rgba(34,197,94,0.4); }
        .ep-swiping-left  .ep-hint-left  { opacity: 1; }
        .ep-swiping-right .ep-hint-right { opacity: 1; }

        /* ── Empty state ── */
        .ep-empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            padding: 72px 24px;
            text-align: center;
            animation: ep-fadeUp 0.45s ease both;
        }
        .ep-empty-icon { font-size: 44px; opacity: 0.25; }
        .ep-empty-title {
            font-family: 'Syne', sans-serif;
            font-size: 20px;
            color: rgba(255,255,255,0.3);
        }
        .ep-empty-sub { font-size: 13px; color: rgba(255,255,255,0.18); }

        /* ── Action bar ── */
        .ep-action-bar {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        /* base button */
        .ep-btn {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            border: none;
            background: transparent;
            cursor: pointer;
            transition:
                transform 0.2s cubic-bezier(0.34,1.56,0.64,1),
                box-shadow 0.2s ease,
                background 0.2s ease,
                border-color 0.2s ease;
            -webkit-tap-highlight-color: transparent;
        }
        .ep-btn:disabled { opacity: 0.28; pointer-events: none; }

        /* ripple */
        .ep-btn::after {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 50%;
            background: rgba(255,255,255,0.07);
            transform: scale(0);
            opacity: 0;
            transition: transform 0.4s ease, opacity 0.4s ease;
        }
        .ep-btn:active::after { transform: scale(1); opacity: 1; }
        .ep-btn:not(:disabled):hover { transform: scale(1.1); }
        .ep-btn:not(:disabled):active { transform: scale(0.92); }

        /* reject */
        .ep-btn-reject {
            width: 72px; height: 72px;
            border: 1.5px solid rgba(127,29,29,0.7);
            background: rgba(127,29,29,0.07);
        }
        .ep-btn-reject:not(:disabled):hover {
            background: rgba(127,29,29,0.18);
            border-color: rgba(239,68,68,0.6);
            box-shadow: 0 0 22px rgba(239,68,68,0.2);
        }

        /* accept */
        .ep-btn-accept {
            width: 80px; height: 80px;
            border: 1.5px solid rgba(21,128,61,0.7);
            background: rgba(21,128,61,0.07);
        }
        .ep-btn-accept:not(:disabled):hover {
            background: rgba(21,128,61,0.18);
            border-color: rgba(34,197,94,0.6);
            box-shadow: 0 0 26px rgba(34,197,94,0.2);
        }

        /* chat (mobile) */
        .ep-btn-chat {
            width: 52px; height: 52px;
            border: 1.5px solid rgba(250,204,21,0.5);
            background: rgba(250,204,21,0.06);
            display: flex;
        }
        @media (min-width: 640px) { .ep-btn-chat { display: none !important; } }
        .ep-btn-chat:hover {
            background: rgba(250,204,21,0.14);
            border-color: rgba(250,204,21,0.8);
            box-shadow: 0 0 18px rgba(250,204,21,0.18);
        }

        /* press-bounce keyframe */
        @keyframes ep-bounce {
            0%   { transform: scale(1); }
            28%  { transform: scale(0.86); }
            62%  { transform: scale(1.16); }
            100% { transform: scale(1); }
        }
        .ep-btn-bouncing { animation: ep-bounce 0.36s cubic-bezier(0.34,1.56,0.64,1) !important; }

        /* ── Match overlay ── */
        .ep-match-backdrop {
            position: fixed;
            inset: 0;
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: ep-backdropIn 0.4s ease forwards;
        }
        @keyframes ep-backdropIn {
            from { background: rgba(0,0,0,0); }
            to   { background: rgba(0,0,0,0.75); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); }
        }

        .ep-match-card {
            background: #0d0d0d;
            border: 1px solid rgba(255,255,255,0.09);
            border-radius: 28px;
            padding: 52px 40px 44px;
            max-width: 360px;
            width: 90%;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 22px;
            animation: ep-cardPop 0.48s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        @keyframes ep-cardPop {
            from { transform: scale(0.65) translateY(40px); opacity: 0; }
            to   { transform: scale(1) translateY(0);       opacity: 1; }
        }

        /* hearts */
        .ep-match-hearts {
            position: relative;
            height: 52px;
            width: 104px;
        }
        .ep-heart {
            position: absolute;
            font-size: 34px;
            animation: ep-heartPop 0.55s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        .ep-heart:nth-child(1) { left: 0;    animation-delay: 0.18s; }
        .ep-heart:nth-child(2) { left: 35px; animation-delay: 0.30s; }
        .ep-heart:nth-child(3) { left: 70px; animation-delay: 0.42s; }
        @keyframes ep-heartPop {
            from { transform: scale(0) rotate(-15deg); opacity: 0; }
            60%  { transform: scale(1.35) rotate(6deg); opacity: 1; }
            to   { transform: scale(1) rotate(0); opacity: 1; }
        }

        .ep-match-title {
            font-family: 'Syne', sans-serif;
            font-size: 34px;
            font-weight: 700;
            background: linear-gradient(135deg, #ff4d6d 0%, #ff8fa3 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1.1;
        }
        .ep-match-sub {
            font-size: 14px;
            color: rgba(255,255,255,0.4);
            line-height: 1.65;
            max-width: 240px;
        }
        .ep-match-sub strong { color: rgba(255,255,255,0.72); font-weight: 500; }

        .ep-match-cta {
            margin-top: 6px;
            padding: 14px 38px;
            border-radius: 50px;
            border: none;
            cursor: pointer;
            font-family: 'DM Sans', sans-serif;
            font-size: 15px;
            font-weight: 500;
            letter-spacing: 0.02em;
            background: linear-gradient(135deg, #ff4d6d, #c9184a);
            color: #fff;
            box-shadow: 0 4px 22px rgba(255,77,109,0.32);
            transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
        }
        .ep-match-cta:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 30px rgba(255,77,109,0.5);
        }
        .ep-match-cta:active { transform: scale(0.95); }

        /* ── Keyframes ── */
        @keyframes ep-spin   { to { transform: rotate(360deg); } }
        @keyframes ep-fadeUp {
            from { opacity: 0; transform: translateY(18px); }
            to   { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(s);
};

interface User {
    _id: string;
    FName: string;
    LName?: string;
    profilePhoto?: string;
    bio?: string;
    country?: string;
    skills?: string[];
}

interface MatchResponse {
    match?: boolean;
}

const useBounce = (): [
    React.RefObject<HTMLButtonElement | null>,
    () => void
] => {
    const ref = useRef<HTMLButtonElement>(null);

    const trigger = (): void => {
        const el = ref.current;
        if (!el) return;

        el.classList.remove("ep-btn-bouncing");
        void el.offsetWidth;
        el.classList.add("ep-btn-bouncing");

        window.setTimeout(() => {
            el.classList.remove("ep-btn-bouncing");
        }, 380);
    };

    return [ref, trigger];
};

/* ════════════════════════════════════════
   ExplorePage
════════════════════════════════════════ */
const ExplorePage = (): React.ReactElement => {
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isSwiping, setIsSwiping] = useState<boolean>(false);
    const [swipeDir, setSwipeDir] = useState<"left" | "right" | null>(null);
    const [matchedUser, setMatchedUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const swipeLock = useRef<boolean>(false);
    const navigate = useNavigate();

    const [rejectRef, bounceReject] = useBounce();
    const [acceptRef, bounceAccept] = useBounce();

    useEffect(() => {
        injectStyles();
    }, []);

    /* ── Auth ── */
    useEffect(() => {
        let cancelled = false;

        const checkAuth = async (): Promise<void> => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/me`,
                    {
                        credentials: "include",
                    }
                );

                if (res.status === 401) {
                    if (!cancelled) {
                        setUser(null);
                        setLoading(false);
                        navigate("/");
                    }
                    return;
                }

                const data: User = await res.json();

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

    /* ── Fetch users ── */
    useEffect(() => {
        if (!user) return;

        let cancelled = false;

        const fetchUsers = async (): Promise<void> => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/feed`,
                    {
                        credentials: "include",
                    }
                );

                if (!res.ok) {
                    throw new Error("Failed to fetch users");
                }

                const data: User[] = await res.json();

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

    const currentUser: User | null =
        users.length > 0 && currentIndex < users.length
            ? users[currentIndex]
            : null;

    /* ── Helpers ── */
    const moveToNext = (): void => {
        setCurrentIndex((prev) =>
            prev + 1 >= users.length ? prev : prev + 1
        );
    };

    const closeMatch = (): void => {
        setMatchedUser(null);
        moveToNext();
    };

    /* ── Right swipe ── */
    const handleRightSwipe = async (): Promise<void> => {
        if (!currentUser || swipeLock.current) return;

        swipeLock.current = true;
        setIsSwiping(true);
        setSwipeDir("right");
        bounceAccept();

        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/swipe/rightSwipe`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userOnFeed: currentUser._id,
                    }),
                }
            );

            if (!res.ok) {
                throw new Error("Right swipe failed");
            }

            const data: MatchResponse = await res.json();

            if (data.match) {
                setMatchedUser(currentUser);
            } else {
                moveToNext();
            }
        } catch (err) {
            console.error("Right swipe error:", err);
        } finally {
            swipeLock.current = false;
            setIsSwiping(false);

            setTimeout(() => {
                setSwipeDir(null);
            }, 350);
        }
    };

    /* ── Left swipe ── */
    const handleLeftSwipe = async (): Promise<void> => {
        if (!currentUser || swipeLock.current) return;

        swipeLock.current = true;
        setIsSwiping(true);
        setSwipeDir("left");
        bounceReject();

        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/swipe/leftSwipe`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userOnFeed: currentUser._id,
                    }),
                }
            );

            if (!res.ok) {
                throw new Error("Left swipe failed");
            }

            moveToNext();
        } catch (err) {
            console.error("Left swipe error:", err);
        } finally {
            swipeLock.current = false;
            setIsSwiping(false);

            setTimeout(() => {
                setSwipeDir(null);
            }, 350);
        }
    };

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
    /* ── Render ── */
    return (
        <div className="ep-root">

            {/* Sticky frosted navbar */}
            <div className="ep-nav-wrap mb-10">
                <Navbar2 />
            </div>

            <div className="ep-columns">

                {/* Left: Aside */}
                <div className="ep-aside"><Aside /></div>

                {/* Centre: card + buttons */}
                <main className="ep-main">

                    {/* Card stage with directional hint overlays */}
                    <div className={`ep-stage${swipeDir ? ` ep-swiping-${swipeDir}` : ""}`}>
                        <div className="ep-hint ep-hint-left" />
                        <div className="ep-hint ep-hint-right" />

                        {currentUser !== null ? (
                            <SwipeCard
                                user={currentUser as User}
                                onAccept={handleRightSwipe}
                                onReject={handleLeftSwipe}
                                matchedUser={matchedUser}
                                closeMatch={closeMatch}
                            />
                        ) : (
                            <div className="ep-empty">
                                <div className="ep-empty-icon">👀</div>
                                <div className="ep-empty-title">You've seen everyone</div>
                                <div className="ep-empty-sub">
                                    Check back later for new profiles
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action buttons */}
                    <div className="ep-action-bar ">

                        {/* Reject */}
                        <button
                            ref={rejectRef}
                            onClick={handleLeftSwipe}
                            disabled={!currentUser || isSwiping}
                            className="ep-btn ep-btn-reject"
                            aria-label="Pass"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="32" height="32" fill="#7F1D1D">
                                <path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" />
                            </svg>
                        </button>

                        {/* Accept */}
                        <button
                            ref={acceptRef}
                            onClick={handleRightSwipe}
                            disabled={!currentUser || isSwiping}
                            className="ep-btn ep-btn-accept"
                            aria-label="Like"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="36" height="36" fill="#15803D">
                                <path d="M378-246 154-470l43-43 181 181 384-384 43 43-427 427Z" />
                            </svg>
                        </button>

                        {/* Chat — mobile only */}
                        <button
                            onClick={() => navigate("/chatPage")}
                            className="ep-btn ep-btn-chat"
                            aria-label="Open chat"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="22" height="22" fill="#FACC15">
                                <path d="M240-400h320v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Z" />
                            </svg>
                        </button>

                    </div>
                </main>

                {/* Right: Chat */}
                <div className="ep-chat"><Chat /></div>

            </div>

            {/* ── Match popup ── */}
            {matchedUser && (
                <div
                    className="ep-match-backdrop"
                    role="dialog"
                    aria-modal="true"
                    aria-label="It's a match!"
                    onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                        if (e.target === e.currentTarget) {
                            closeMatch();
                        }
                    }}
                >
                    <div className="ep-match-card">

                        <div className="ep-match-hearts">
                            <span className="ep-heart">💖</span>
                            <span className="ep-heart">💗</span>
                            <span className="ep-heart">💖</span>
                        </div>

                        <div className="ep-match-title">It's a Match!</div>

                        <p className="ep-match-sub">
                            You and <strong>{matchedUser?.FName}</strong> liked each other.
                            <br />
                            Start a conversation!
                        </p>

                        <button className="ep-match-cta" onClick={closeMatch}>
                            Keep Exploring
                        </button>

                    </div>
                </div>
            )}

        </div>
    );
};

export default ExplorePage;
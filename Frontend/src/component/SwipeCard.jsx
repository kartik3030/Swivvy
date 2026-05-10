import React, { useState, useRef } from "react";
import { useSwipeable } from "react-swipeable";

/* ─── Global styles injected once ─── */
const injectStyles = () => {
    if (document.getElementById("swipecard-styles")) return;
    const s = document.createElement("style");
    s.id = "swipecard-styles";
    s.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        /* ── Card shell ── */
        .sc-root {
            position: relative;
            margin-top: 16px;
            width: 100%;
            max-width: 420px;
            height: 72vh;
            max-height: 600px;
            border-radius: 22px;
            overflow: hidden;
            user-select: none;
            touch-action: pan-y;
            cursor: grab;
            font-family: 'DM Sans', sans-serif;
        }
        .sc-root:active { cursor: grabbing; }

        @media (min-width: 640px) {
            .sc-root {
                width: 380px;
                height: 580px;
            }
        }

        /* drag tilt */
        .sc-root {
            transition: transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                        box-shadow 0.25s ease;
            will-change: transform;
        }
        .sc-root.sc-dragging {
            transition: none;
        }

        /* ── Photo ── */
        .sc-photo {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center top;
            pointer-events: none;
            transition: transform 0.6s ease;
        }
        .sc-root:hover .sc-photo {
            transform: scale(1.03);
        }

        /* vignette */
        .sc-vignette {
            position: absolute;
            inset: 0;
            background: linear-gradient(
                to bottom,
                rgba(0,0,0,0) 35%,
                rgba(0,0,0,0.5) 65%,
                rgba(0,0,0,0.92) 100%
            );
            pointer-events: none;
            z-index: 2;
        }

        /* ── Swipe hint badges ── */
        .sc-badge {
            position: absolute;
            top: 28px;
            z-index: 10;
            padding: 6px 18px;
            border-radius: 8px;
            font-family: 'Syne', sans-serif;
            font-size: 22px;
            font-weight: 800;
            letter-spacing: 0.06em;
            opacity: 0;
            transform: rotate(-15deg) scale(0.7);
            transition: opacity 0.15s ease, transform 0.15s ease;
            pointer-events: none;
            border: 3px solid;
        }
        .sc-badge-like {
            left: 24px;
            color: #4ade80;
            border-color: #4ade80;
            background: rgba(0,0,0,0.35);
            transform: rotate(-15deg) scale(0.7);
        }
        .sc-badge-nope {
            right: 24px;
            color: #f87171;
            border-color: #f87171;
            background: rgba(0,0,0,0.35);
            transform: rotate(15deg) scale(0.7);
        }
        .sc-badge.sc-badge-visible {
            opacity: 1;
            transform: rotate(-12deg) scale(1);
        }
        .sc-badge-nope.sc-badge-visible {
            transform: rotate(12deg) scale(1);
        }

        /* ── Info panel ── */
        .sc-info {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 5;
            padding: 20px 20px 24px;
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-top: 1px solid rgba(255,255,255,0.07);
            transition: transform 0.3s ease;
        }

        .sc-name-row {
            display: flex;
            align-items: baseline;
            gap: 10px;
            margin-bottom: 10px;
        }
        .sc-name {
            font-family: 'Syne', sans-serif;
            font-size: 26px;
            font-weight: 700;
            color: #fff;
            line-height: 1;
        }
        .sc-location {
            display: flex;
            align-items: center;
            gap: 3px;
            font-size: 13px;
            color: rgba(255,255,255,0.5);
            font-weight: 400;
        }
        .sc-location svg { flex-shrink: 0; }

        /* skills */
        .sc-skills {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-bottom: 10px;
        }
        .sc-skill {
            padding: 4px 12px;
            border-radius: 50px;
            font-size: 12px;
            font-weight: 500;
            border: 1px solid rgba(255,255,255,0.15);
            background: rgba(255,255,255,0.07);
            color: rgba(255,255,255,0.8);
            letter-spacing: 0.02em;
            transition: background 0.2s, border-color 0.2s;
        }
        /* orange gradient text to match original */
        .sc-skill-text {
            background: linear-gradient(90deg, #f97316, #c2410c);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 700;
        }

        .sc-bio {
            font-size: 13px;
            color: rgba(255,255,255,0.5);
            line-height: 1.5;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        /* ── Empty state ── */
        .sc-empty {
            position: relative;
            margin-top: 16px;
            width: 100%;
            max-width: 420px;
            height: 72vh;
            max-height: 600px;
            border-radius: 22px;
            background: #0a0a0a;
            border: 1px solid rgba(255,255,255,0.06);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 12px;
            animation: sc-fadeUp 0.4s ease both;
        }
        @media (min-width: 640px) {
            .sc-empty { width: 380px; height: 580px; }
        }
        .sc-empty-icon { font-size: 40px; opacity: 0.2; }
        .sc-empty-text {
            font-family: 'Syne', sans-serif;
            font-size: 18px;
            color: rgba(255,255,255,0.25);
        }

        /* ── Match overlay ── */
        .sc-match-overlay {
            position: absolute;
            inset: 0;
            z-index: 50;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: sc-overlayIn 0.35s ease forwards;
            border-radius: 22px;
            overflow: hidden;
        }
        @keyframes sc-overlayIn {
            from { opacity: 0; backdrop-filter: blur(0px); background: rgba(0,0,0,0); }
            to   { opacity: 1; backdrop-filter: blur(18px); background: rgba(0,0,0,0.72); }
        }

        .sc-match-inner {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 14px;
            padding: 32px 28px;
            text-align: center;
            animation: sc-matchPop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s both;
        }
        @keyframes sc-matchPop {
            from { transform: scale(0.6) translateY(30px); opacity: 0; }
            to   { transform: scale(1) translateY(0); opacity: 1; }
        }

        .sc-match-hearts {
            display: flex;
            gap: 4px;
        }
        .sc-match-heart {
            font-size: 28px;
            animation: sc-heartBeat 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        .sc-match-heart:nth-child(1) { animation-delay: 0.15s; }
        .sc-match-heart:nth-child(2) { animation-delay: 0.28s; }
        .sc-match-heart:nth-child(3) { animation-delay: 0.41s; }
        @keyframes sc-heartBeat {
            from { transform: scale(0) rotate(-20deg); opacity: 0; }
            60%  { transform: scale(1.4) rotate(5deg); opacity: 1; }
            to   { transform: scale(1) rotate(0); opacity: 1; }
        }

        .sc-match-title {
            font-family: 'Syne', sans-serif;
            font-size: 28px;
            font-weight: 800;
            background: linear-gradient(135deg, #fb923c, #ea580c);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1.1;
        }

        .sc-match-avatar {
            width: 88px;
            height: 88px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid rgba(249,115,22,0.5);
            animation: sc-avatarIn 0.45s cubic-bezier(0.34,1.56,0.64,1) 0.25s both;
            box-shadow: 0 0 28px rgba(249,115,22,0.25);
        }
        @keyframes sc-avatarIn {
            from { transform: scale(0); opacity: 0; }
            to   { transform: scale(1); opacity: 1; }
        }

        .sc-match-name {
            font-family: 'Syne', sans-serif;
            font-size: 20px;
            font-weight: 700;
            color: #fff;
        }

        .sc-match-cta {
            margin-top: 4px;
            width: 200px;
            height: 44px;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            font-family: 'DM Sans', sans-serif;
            font-size: 15px;
            font-weight: 500;
            background: linear-gradient(135deg, #f97316, #c2410c);
            color: #fff;
            box-shadow: 0 4px 20px rgba(249,115,22,0.35);
            transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
        }
        .sc-match-cta:hover {
            transform: scale(1.06);
            box-shadow: 0 6px 28px rgba(249,115,22,0.5);
        }
        .sc-match-cta:active { transform: scale(0.94); }

        /* ── Keyframes ── */
        @keyframes sc-fadeUp {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(s);
};

/* ─── Image resolver (unchanged logic) ─── */
const resolveImage = (path) => {
    if (!path) return "https://i.pinimg.com/474x/3d/8d/b1/3d8db18cc50c15523a13908a593a480c.jpg";
    if (path.startsWith("http")) return path;
    if (path.startsWith("/uploads")) return `${import.meta.env.VITE_API_URL}${path}`;
    return "https://i.pinimg.com/474x/3d/8d/b1/3d8db18cc50c15523a13908a593a480c.jpg";
};

/* ════════════════════════════════════════
   SwipeCard
════════════════════════════════════════ */
const SwipeCard = ({ user, onAccept, onReject, matchedUser, closeMatch }) => {
    // inject styles once
    React.useEffect(() => { injectStyles(); }, []);

    const [dragDir, setDragDir] = useState(null); // 'left' | 'right' | null
    const [tilt, setTilt] = useState({ x: 0, rotate: 0 });
    const isDragging = useRef(false);

    /* ── Swipeable handlers ── */
    const handlers = useSwipeable({
        onSwiping: ({ deltaX }) => {
            if (!isDragging.current) isDragging.current = true;
            const rotate = Math.min(Math.max(deltaX / 18, -12), 12);
            const dir = deltaX > 20 ? "right" : deltaX < -20 ? "left" : null;
            setTilt({ x: deltaX * 0.08, rotate });
            setDragDir(dir);
        },
        onSwipedRight: () => {
            resetTilt();
            onAccept?.(user);
        },
        onSwipedLeft: () => {
            resetTilt();
            onReject?.(user);
        },
        onTouchEndOrOnMouseUp: () => {
            resetTilt();
        },
        preventScrollOnSwipe: true,
        trackMouse: true,
        delta: 10,
    });

    const resetTilt = () => {
        isDragging.current = false;
        setTilt({ x: 0, rotate: 0 });
        setDragDir(null);
    };

    /* ── Empty state ── */
    if (!user) {
        return (
            <div className="sc-empty">
                <div className="sc-empty-icon">🌟</div>
                <div className="sc-empty-text">No one left to explore</div>
            </div>
        );
    }

    const cardStyle = {
        transform: `translateX(${tilt.x}px) rotate(${tilt.rotate}deg)`,
    };

    return (
        <div
            {...handlers}
            className={`sc-root ${isDragging.current ? "sc-dragging" : ""}`}
            style={cardStyle}
        >
            {/* Photo */}
            <img
                src={resolveImage(user.profilePhoto)}
                alt="profile"
                className="sc-photo"
                loading="eager"
                decoding="async"
            />

            {/* Vignette */}
            <div className="sc-vignette" />

            {/* LIKE badge */}
            <div className={`sc-badge sc-badge-like${dragDir === "right" ? " sc-badge-visible" : ""}`}>
                LIKE
            </div>

            {/* NOPE badge */}
            <div className={`sc-badge sc-badge-nope${dragDir === "left" ? " sc-badge-visible" : ""}`}>
                NOPE
            </div>

            {/* User info */}
            <div className="sc-info">
                <div className="sc-name-row">
                    <span className="sc-name">{user.FName}</span>
                    <span className="sc-location">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                        {user.country || "India"}
                    </span>
                </div>

                {user.skills?.length > 0 && (
                    <div className="sc-skills">
                        {user.skills.slice(0, 6).map((skill, i) => (
                            <div key={i} className="sc-skill">
                                <span className="sc-skill-text">{skill}</span>
                            </div>
                        ))}
                    </div>
                )}

                <p className="sc-bio">{user.bio || "No bio provided"}</p>
            </div>

            {/* Match overlay */}
            {matchedUser && matchedUser._id === user._id && (
                <div className="sc-match-overlay">
                    <div className="sc-match-inner">

                        <div className="sc-match-hearts">
                            <span className="sc-match-heart">💖</span>
                            <span className="sc-match-heart">💗</span>
                            <span className="sc-match-heart">💖</span>
                        </div>

                        <div className="sc-match-title">It's a Match!</div>

                        <img
                            src={resolveImage(matchedUser.profilePhoto)}
                            alt="match"
                            className="sc-match-avatar"
                        />

                        <div className="sc-match-name">{matchedUser.FName}</div>

                        <button className="sc-match-cta" onClick={closeMatch}>
                            Continue
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
};

export default SwipeCard;
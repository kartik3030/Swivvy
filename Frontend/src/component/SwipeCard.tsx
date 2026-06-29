import React, { useState, useRef } from "react";
import { useSwipeable } from "react-swipeable";

interface SwipeUser {
    _id: string;
    FName: string;
    profilePhoto?: string;
    country?: string;
    skills?: string[];
    bio?: string;
}

interface SwipeCardProps {
    user: SwipeUser | null;
    onAccept?: (user: SwipeUser) => void;
    onReject?: (user: SwipeUser) => void;
    matchedUser: SwipeUser | null;
    closeMatch: () => void;
}

type DragDirection = "left" | "right" | null;

interface TiltState {
    x: number;
    rotate: number;
}

/* ─── Global styles injected once ─── */
const injectStyles = (): void => {
    if (document.getElementById("swipecard-styles")) return;

    const s = document.createElement("style");
    s.id = "swipecard-styles";

    s.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

      .sc-root {
    position: relative;
    margin-top: 2px;
    width: 100%;
    max-width: 420px;
    height: 70vh;
    max-height: 600px;
    border-radius: 22px;
    overflow: hidden;
    user-select: none;
    touch-action: pan-y;
    cursor: grab;
    font-family: 'DM Sans', sans-serif;
    transition: transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                box-shadow 0.25s ease;
    will-change: transform;
}

        .sc-root:active {
            cursor: grabbing;
        }

        .sc-root.sc-dragging {
            transition: none;
        }

        @media (min-width: 640px) {
            .sc-root {
                width: 380px;
                height: 580px;
            }
        }

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

        .sc-info {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 5;
            padding: 20px 20px 24px;
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(16px);
            border-top: 1px solid rgba(255,255,255,0.07);
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
        }

        .sc-location {
            display: flex;
            align-items: center;
            gap: 3px;
            font-size: 13px;
            color: rgba(255,255,255,0.5);
        }

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
            border: 1px solid rgba(255,255,255,0.15);
            background: rgba(255,255,255,0.07);
        }

        .sc-skill-text {
            background: linear-gradient(90deg, #f97316, #c2410c);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: 700;
        }

        .sc-bio {
            font-size: 13px;
            color: rgba(255,255,255,0.5);
            line-height: 1.5;
        }

        .sc-empty {
            width: 380px;
            height: 580px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }

        .sc-match-overlay {
            position: absolute;
            inset: 0;
            z-index: 50;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0,0,0,0.72);
        }

        .sc-match-inner {
            text-align: center;
        }

        .sc-match-avatar {
            width: 88px;
            height: 88px;
            border-radius: 50%;
            object-fit: cover;
        }

        .sc-match-cta {
            margin-top: 10px;
            padding: 12px 20px;
            border: none;
            border-radius: 50px;
            cursor: pointer;
        }
    `;

    document.head.appendChild(s);
};

const FALLBACK_IMG =
    "https://i.pinimg.com/474x/3d/8d/b1/3d8db18cc50c15523a13908a593a480c.jpg";

const resolveImage = (path?: string): string => {
    return path || FALLBACK_IMG;
};

const SwipeCard = ({
    user,
    onAccept,
    onReject,
    matchedUser,
    closeMatch,
}: SwipeCardProps) => {
    React.useEffect(() => {
        injectStyles();
    }, []);

    const [dragDir, setDragDir] = useState<DragDirection>(null);
    const [tilt, setTilt] = useState<TiltState>({
        x: 0,
        rotate: 0,
    });

    const isDragging = useRef<boolean>(false);

    const resetTilt = (): void => {
        isDragging.current = false;
        setTilt({ x: 0, rotate: 0 });
        setDragDir(null);
    };

    const handlers = useSwipeable({
        onSwiping: ({ deltaX }: { deltaX: number }) => {
            if (!isDragging.current) {
                isDragging.current = true;
            }

            const rotate = Math.min(Math.max(deltaX / 18, -12), 12);
            const dir: DragDirection =
                deltaX > 20 ? "right" : deltaX < -20 ? "left" : null;

            setTilt({
                x: deltaX * 0.08,
                rotate,
            });

            setDragDir(dir);
        },

        onSwipedRight: () => {
            resetTilt();
            if (user) onAccept?.(user);
        },

        onSwipedLeft: () => {
            resetTilt();
            if (user) onReject?.(user);
        },

        onTouchEndOrOnMouseUp: () => {
            resetTilt();
        },

        preventScrollOnSwipe: true,
        trackMouse: true,
        delta: 10,
    });

    if (!user) {
        return (
            <div className="sc-empty">
                <div>No one left to explore</div>
            </div>
        );
    }

    const cardStyle: React.CSSProperties = {
        transform: `translateX(${tilt.x}px) rotate(${tilt.rotate}deg)`,
    };

    return (
        <div
            {...handlers}
            className={`sc-root ${isDragging.current ? "sc-dragging" : ""}`}
            style={cardStyle}
        >
            <img
                src={resolveImage(user.profilePhoto)}
                alt="profile"
                className="sc-photo"
            />

            <div className="sc-vignette" />

            <div
                className={`sc-badge sc-badge-like ${dragDir === "right" ? "sc-badge-visible" : ""
                    }`}
            >
                LIKE
            </div>

            <div
                className={`sc-badge sc-badge-nope ${dragDir === "left" ? "sc-badge-visible" : ""
                    }`}
            >
                NOPE
            </div>

            <div className="sc-info">
                <div className="sc-name-row">
                    <span className="sc-name">{user.FName}</span>
                    <span className="sc-location">{user.country || "India"}</span>
                </div>

                {user.skills?.length ? (
                    <div className="sc-skills">
                        {user.skills.slice(0, 6).map((skill: string, i: number) => (
                            <div key={i} className="sc-skill">
                                <span className="sc-skill-text">{skill}</span>
                            </div>
                        ))}
                    </div>
                ) : null}

                <p className="sc-bio">{user.bio || "No bio provided"}</p>
            </div>

            {matchedUser && matchedUser._id === user._id && (
                <div className="sc-match-overlay">
                    <div className="sc-match-inner">
                        <div>It's a Match!</div>

                        <img
                            src={resolveImage(matchedUser.profilePhoto)}
                            alt="match"
                            className="sc-match-avatar"
                        />

                        <div>{matchedUser.FName}</div>

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
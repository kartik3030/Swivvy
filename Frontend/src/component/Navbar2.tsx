import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

interface User {
    FName?: string;
    profilePhoto?: string;
}

interface AvatarImgProps {
    user: User | null;
}

const Navbar = () => {
    const [scrolled, setScrolled] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const location = useLocation();

    useEffect(() => {
        const onScroll = (): void => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", onScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    useEffect(() => {
        const fetchUser = async (): Promise<void> => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/me`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch user data");
                }

                const data: User = await res.json();
                setUser(data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchUser();
    }, []);

    const isActive = (path: string): boolean => location.pathname === path;

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;600;700&display=swap');

        @keyframes navFadeDown {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes blink {
          0%,100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .nav-root {
          animation: navFadeDown 0.6s cubic-bezier(.16,1,.3,1) both;
        }

        .nav-logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.65rem;
          letter-spacing: 0.1em;
          color: #fff;
          text-decoration: none;
          position: relative;
          transition: color 0.2s;
        }

        .nav-logo::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #f97316, #7f1d1d);
          border-radius: 2px;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s cubic-bezier(.4,0,.2,1);
        }

        .nav-logo:hover::after {
          transform: scaleX(1);
        }

     

        .nav-avatar-wrap {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
        }

        .nav-avatar-wrap:hover {
          transform: translateY(-1px);
        }

        .nav-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          object-fit: cover;
          display: block;
          border: 2px solid rgba(255,255,255,0.15);
          transition: border-color 0.25s, box-shadow 0.25s;
        }

        .nav-avatar-wrap:hover .nav-avatar {
          border-color: #f97316;
          box-shadow: 0 0 0 3px rgba(249,115,22,0.2);
        }

        .nav-avatar-online {
          position: absolute;
          bottom: 1px;
          right: 1px;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #22c55e;
          border: 2px solid #000;
        }
      `}</style>

            <nav
                className="nav-root"
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 100,
                    padding: scrolled ? "0.6rem 0" : "0.85rem 0",
                    background: scrolled
                        ? "rgba(0,0,0,0.85)"
                        : "rgba(0,0,0,0.4)",
                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",
                    borderBottom: scrolled
                        ? "1px solid rgba(255,255,255,0.06)"
                        : "1px solid transparent",
                    transition: "padding 0.3s, background 0.3s, border-color 0.3s",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        maxWidth: 1300,
                        margin: "0 auto",
                        padding: "0 2rem",
                    }}
                >
                    <Link
                        to="/"
                        className="nav-logo"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        <span />
                        SWIVVY
                    </Link>

                    <Link to="/profile" style={{ textDecoration: "none" }}>
                        <div className="nav-avatar-wrap">
                            <AvatarImg user={user} />
                        </div>
                    </Link>
                </div>
            </nav>
        </>
    );
};

function AvatarImg({ user }: AvatarImgProps) {
    const [errored, setErrored] = useState<boolean>(false);

    const imgSrc = user?.profilePhoto
        ? user.profilePhoto.startsWith("http")
            ? user.profilePhoto
            : `${import.meta.env.VITE_API_URL}${user.profilePhoto}`
        : null;

    const fallbackLetter = user?.FName?.charAt(0)?.toUpperCase() || "U";

    if (!imgSrc || errored) {
        return (
            <div
                style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #f97316, #7f1d1d)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: "1rem",
                    border: "2px solid rgba(255,255,255,0.15)",
                }}
            >
                {fallbackLetter}
            </div>
        );
    }

    return (
        <img
            src={imgSrc}
            alt="User profile"
            className="nav-avatar"
            onError={() => setErrored(true)}
        />
    );
}

export default Navbar;
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
    const [scrolled, setScrolled] = useState<boolean>(false);
    const location = useLocation();

    useEffect(() => {
        const onScroll = (): void => setScrolled(window.scrollY > 20);

        window.addEventListener("scroll", onScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    const isActive = (path: string): boolean => location.pathname === path;

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;600;700&display=swap');

        @keyframes navFadeDown {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes blink {
          0%,100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .nav-root {
          animation: navFadeDown 0.6s cubic-bezier(.16,1,.3,1) both;
        }

        .nav-link-btn {
          background: none;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 0.88rem;
          cursor: pointer;
          padding: 0.4rem 1rem;
          border-radius: 999px;
          letter-spacing: 0.03em;
          transition: color 0.2s, background 0.2s;
          color: rgba(255,255,255,0.6);
        }

        .nav-link-btn:hover {
          color: #fff;
          background: rgba(255,255,255,0.06);
        }

        .nav-link-btn.active {
          color: #fff;
          background: rgba(255,255,255,0.08);
        }

        .nav-cta {
          background: linear-gradient(135deg, #f97316, #c2410c);
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-weight: 800;
          font-size: 0.88rem;
          cursor: pointer;
          padding: 0.45rem 1.3rem;
          border-radius: 999px;
          color: #fff;
          letter-spacing: 0.03em;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .nav-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(249,115,22,0.4);
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
                        <span className="" />
                        SWIVVY
                    </Link>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.35rem",
                        }}
                    >
                        <Link to="/login" style={{ textDecoration: "none" }}>
                            <button
                                className={`nav-link-btn ${isActive("/login") ? "active" : ""}`}
                            >
                                Login
                            </button>
                        </Link>

                        <Link to="/signup" style={{ textDecoration: "none" }}>
                            <button className="nav-cta">Sign Up</button>
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
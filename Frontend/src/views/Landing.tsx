import React, { useState, useEffect, useRef } from 'react'
import { Link } from "react-router-dom"
import Navbar from "../component/Navbar"


const navBtnStyle = { background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', borderRadius: '999px', padding: '0.4rem 1.2rem', cursor: 'pointer', fontFamily: 'inherit' }
const Footer = () => (
    <footer style={{ background: '#000', color: '#555', textAlign: 'center', padding: '2rem', fontFamily: 'sans-serif', fontSize: '0.8rem', borderTop: '1px solid #111' }}>
        Swivvy · Find people by skills, not by resume
    </footer>
)

// ── Hook: intersection observer for reveal animations ──
function useReveal(
    threshold: number = 0.15
): [React.RefObject<HTMLDivElement | null>, boolean] {
    const ref = useRef(null)
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        const el = ref.current
        if (!el) return
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold })
        obs.observe(el)
        return () => obs.disconnect()
    }, [])
    return [ref, visible]
}

// ── Floating card component ──
interface FloatCardProps {
    src: string;
    name: string;
    sub: string;
    accent: string;
    delay?: number;
    style?: React.CSSProperties;
}

const FloatCard = ({
    src,
    name,
    sub,
    accent,
    delay = 0,
    style = {},
}: FloatCardProps): React.ReactElement => (
    <div
        style={{
            background: "rgba(10,10,10,0.9)",
            border: `1px solid ${accent}`,
            borderRadius: 16,
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            animation: `floatY 4s ease-in-out ${delay}s infinite alternate`,
            transition: "border-color 0.3s, box-shadow 0.3s",
            cursor: "default",
            ...style,
        }}
        onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
            e.currentTarget.style.borderColor = "#f97316";
            e.currentTarget.style.boxShadow =
                "0 0 24px rgba(249,115,22,0.25)";
        }}
        onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
            e.currentTarget.style.borderColor = accent;
            e.currentTarget.style.boxShadow = "none";
        }}
    >
        <img
            src={src}
            alt={name}
            style={{
                width: 80,
                height: 80,
                objectFit: "cover",
                borderRadius: 12,
            }}
        />

        <span
            style={{
                color: "#fff",
                fontWeight: 800,
                fontFamily: "'Bebas Neue', sans-serif",
                letterSpacing: "0.05em",
                fontSize: "1.1rem",
            }}
        >
            {name}
        </span>

        <span
            style={{
                color: "#aaa",
                fontSize: "0.75rem",
            }}
        >
            {sub}
        </span>

        <button
            style={{
                marginTop: 4,
                padding: "0.35rem 1.4rem",
                borderRadius: 999,
                background: "linear-gradient(135deg,#f97316,#c2410c)",
                color: "#fff",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                fontSize: "0.8rem",
            }}
        >
            Chat
        </button>
    </div>
);

// ── Step card ──
interface StepCardProps {
    icon: string;
    label: string;
    active?: boolean;
}

const StepCard = ({
    icon,
    label,
    active = false,
}: StepCardProps): React.ReactElement => (
    <div
        style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "1.5rem 1rem",
            borderRadius: 12,
            background: active
                ? "linear-gradient(135deg,#7f1d1d,#991b1b)"
                : "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#fff",
            transition: "all 0.3s",
            cursor: "default",
            minWidth: 130,
        }}
        onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
            e.currentTarget.style.background =
                "linear-gradient(135deg,#7f1d1d,#991b1b)";
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow =
                "0 12px 32px rgba(153,27,27,0.4)";
        }}
        onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
            e.currentTarget.style.background = active
                ? "linear-gradient(135deg,#7f1d1d,#991b1b)"
                : "rgba(255,255,255,0.05)";
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = "none";
        }}
    >
        <span
            className="material-symbols-outlined"
            style={{
                fontSize: 32,
                color: active ? "#fff" : "#f97316",
            }}
        >
            {icon}
        </span>

        <span
            style={{
                fontFamily: "'Bebas Neue', sans-serif",
                letterSpacing: "0.06em",
                fontSize: "1rem",
            }}
        >
            {label}
        </span>
    </div>
);

// ── Section wrapper ──
interface SectionProps {
    children: React.ReactNode;
    style?: React.CSSProperties;
}

const Section = ({
    children,
    style = {},
}: SectionProps): React.ReactElement => {
    const [ref, vis] = useReveal();

    return (
        <div
            ref={ref}
            style={{
                opacity: vis ? 1 : 0,
                transform: vis ? "translateY(0)" : "translateY(40px)",
                transition: "opacity 0.8s ease, transform 0.8s ease",
                ...style,
            }}
        >
            {children}
        </div>
    );
};

const Landing = () => {
    const [scrollY, setScrollY] = useState(0)
    useEffect(() => {
        const onScroll = () => setScrollY(window.scrollY)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #000; }

        @keyframes floatY {
          from { transform: translateY(0px); }
          to   { transform: translateY(-14px); }
        }
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(60px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulseGlow {
          0%,100% { box-shadow: 0 0 20px rgba(249,115,22,0.2); }
          50%      { box-shadow: 0 0 40px rgba(249,115,22,0.5); }
        }
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes blink {
          0%,100% { opacity: 1; }
          50%      { opacity: 0; }
        }
        .hero-word {
          display: inline-block;
          animation: heroFadeUp 0.9s cubic-bezier(.16,1,.3,1) both;
        }
        .hero-word:nth-child(1){ animation-delay: 0.1s }
        .hero-word:nth-child(2){ animation-delay: 0.25s }
        .hero-word:nth-child(3){ animation-delay: 0.4s }
        .hero-word:nth-child(4){ animation-delay: 0.55s }
        .cta-btn {
          padding: 0.7rem 2rem; border-radius: 999px; font-weight: 800;
          font-family: 'DM Sans', sans-serif; font-size: 0.95rem; cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          border: none;
        }
        .cta-btn:hover { transform: translateY(-2px) scale(1.04); box-shadow: 0 8px 28px rgba(249,115,22,0.45); }
        .cta-btn-outline {
          padding: 0.7rem 2rem; border-radius: 999px; font-weight: 800;
          font-family: 'DM Sans', sans-serif; font-size: 0.95rem; cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
          border: 2px solid rgba(255,255,255,0.3);
          background: transparent; color: #fff;
        }
        .cta-btn-outline:hover { border-color: #fef9c3; transform: translateY(-2px); }
        .noise-overlay {
          position: absolute; inset: 0; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.4;
        }
        .gradient-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(249,115,22,0.5), rgba(153,27,27,0.5), transparent);
        }
        .stat-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 0.4rem 1rem; border-radius: 999px;
          border: 1px solid rgba(249,115,22,0.3);
          background: rgba(249,115,22,0.08);
          color: #fb923c; font-family: 'DM Sans', sans-serif; font-size: 0.82rem;
          animation: pulseGlow 3s ease-in-out infinite;
        }
        .tag-chip {
          padding: 0.25rem 0.8rem; border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          color: #ccc; font-size: 0.75rem; font-family: 'DM Sans', sans-serif;
        }
      `}</style>

            <Navbar />

            {/* ══════════════════════ HERO ══════════════════════ */}
            <section style={{
                minHeight: '100vh', background: '#000', position: 'relative', overflow: 'hidden',
                display: 'flex', alignItems: 'center',
                fontFamily: "'DM Sans', sans-serif",
                paddingTop: 80,
            }}>
                <div className="noise-overlay" />

                {/* ambient glow blobs */}
                <div style={{ position: 'absolute', top: '10%', left: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(153,27,27,0.18) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

                {/* grid lines */}
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

                <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 2rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '3rem', flexWrap: 'wrap' }}>

                    {/* Left */}
                    <div style={{ flex: '1 1 400px', maxWidth: 560 }}>

                        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", lineHeight: 0.92, letterSpacing: '0.02em' }}>
                            {['Find', 'people', 'by skills,', 'not by resume'].map((w, i) => (
                                <span key={i} className="hero-word" style={{
                                    display: 'block',
                                    fontSize: 'clamp(3.5rem, 8vw, 7rem)',
                                    color: i < 3 ? '#7f1d1d' : '#fff',
                                }}>{w}</span>
                            ))}
                        </h1>

                        <p style={{ color: '#888', marginTop: '1.5rem', lineHeight: 1.65, maxWidth: 400, animation: 'heroFadeUp 0.9s 0.7s both' }}>
                            Stop sifting through resumes. Discover collaborators by what they can actually do.
                        </p>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem', flexWrap: 'wrap', animation: 'heroFadeUp 0.9s 0.85s both' }}>
                            <Link to="/signup"><button className="cta-btn" style={{ background: 'linear-gradient(135deg,#f97316,#c2410c)', color: '#fff' }}>Join Now</button></Link>
                            <Link to="/signup"><button className="cta-btn-outline">Register</button></Link>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', flexWrap: 'wrap', animation: 'heroFadeUp 0.9s 1s both' }}>
                            {['React', 'Design', 'ML', 'Finance', 'Chess', 'Writing'].map(t => (
                                <span key={t} className="tag-chip">{t}</span>
                            ))}
                        </div>
                    </div>

                    {/* Right — floating cards */}
                    <div style={{ flex: '1 1 340px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', padding: '2rem 0', animation: 'heroFadeUp 0.9s 0.4s both' }}>
                        <FloatCard
                            src="https://i.pinimg.com/736x/fb/35/41/fb35411697c03cf8b3d09ee89856098d.jpg"
                            name="Rhea" sub="Money & Finance"
                            accent="rgba(156,163,175,0.3)" delay={0}
                            style={{ width: 180 }}
                        />
                        <FloatCard
                            src="https://i.pinimg.com/originals/6e/76/b1/6e76b167bb0b2160ba3e84d9abc2a30a.jpg"
                            name="Clave" sub="Code & Chill"
                            accent="rgba(167,139,250,0.4)" delay={0.8}
                            style={{ width: 180, marginTop: -30 }}
                        />
                        <FloatCard
                            src="https://i.pinimg.com/736x/2a/43/21/2a4321d71391e8caebfd6cd4b8cbd442.jpg"
                            name="Joe" sub="Data Science"
                            accent="rgba(156,163,175,0.3)" delay={1.6}
                            style={{ width: 180, }}
                        />
                    </div>
                </div>
            </section>

            <div className="gradient-line" />

            {/* ══════════════════════ HOW IT'S DONE ══════════════════════ */}
            <Section style={{ background: '#000', padding: '6rem 2rem', fontFamily: "'DM Sans', sans-serif" }}>
                <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
                    <p style={{ color: '#f97316', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.2em', fontSize: '0.9rem', marginBottom: '0.75rem' }}>THE PROCESS</p>
                    <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3rem,7vw,6rem)', color: '#fff', letterSpacing: '0.02em', lineHeight: 1 }}>
                        How it's <span style={{ color: '#7f1d1d' }}>Done?</span>
                    </h2>
                    <p style={{ color: '#666', marginTop: '1rem', marginBottom: '3rem' }}>Three steps to your next great collaboration</p>

                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <StepCard icon="account_circle" label="Create Profile" />
                        <span style={{ color: '#333', fontSize: '1.5rem', fontWeight: 300 }}>→</span>
                        <StepCard icon="face" label="Explore People" />
                        <span style={{ color: '#333', fontSize: '1.5rem', fontWeight: 300 }}>→</span>
                        <StepCard icon="group" label="Collaborate" />
                        <span style={{ color: '#333', fontSize: '1.5rem', fontWeight: 300 }}>→</span>
                        <Link to="/signup">
                            <div style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                gap: 8, padding: '1.5rem 1rem', borderRadius: 12, minWidth: 130,
                                background: 'linear-gradient(135deg,#f97316,#c2410c)',
                                color: '#fff', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(249,115,22,0.4)' }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: 32 }}>rocket_launch</span>
                                <span style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.06em', fontSize: '1rem' }}>Join Now</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </Section>

            <div className="gradient-line" />

            {/* ══════════════════════ FIND YOUR MATCH ══════════════════════ */}
            <Section style={{ position: 'relative', minHeight: '90vh', overflow: 'hidden', fontFamily: "'DM Sans', sans-serif" }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url("https://i.ytimg.com/vi/Ov-K6GSpVxg/maxresdefault.jpg")`,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    filter: 'brightness(0.35)',
                    transform: `translateY(${scrollY * 0.12}px)`,
                    transition: 'transform 0.1s linear',
                }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to left, rgba(0,0,0,0.8) 40%, transparent)' }} />
                <div className="noise-overlay" />

                <div style={{ position: 'relative', zIndex: 2, minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '4rem 3rem' }}>
                    <div style={{ maxWidth: 520, textAlign: 'right' }}>
                        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3.5rem,8vw,7rem)', color: '#fff', lineHeight: 0.9, letterSpacing: '0.02em' }}>
                            Find <br /> Your <br /> <span style={{ color: '#7f1d1d' }}>Match</span>
                        </h2>
                        <p style={{ color: '#ccc', marginTop: '1.5rem', lineHeight: 1.7, maxWidth: 380, marginLeft: 'auto' }}>
                            No more mid matches. Find the people who actually feel like your type of human.
                        </p>
                        <Link to="/signup">
                            <button className="cta-btn" style={{ background: 'linear-gradient(135deg,#f97316,#c2410c)', color: '#fff', marginTop: '2rem' }}>
                                Explore
                            </button>
                        </Link>
                    </div>
                </div>
            </Section>

            <div className="gradient-line" />

            {/* ══════════════════════ CONNECT & COLLABORATE ══════════════════════ */}
            <Section style={{ position: 'relative', minHeight: '90vh', overflow: 'hidden', fontFamily: "'DM Sans', sans-serif" }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url("https://i.ytimg.com/vi/3ZyEnuqyu0k/maxresdefault.jpg")`,
                    backgroundSize: 'cover', backgroundPosition: 'center right',
                    filter: 'brightness(0.3)',
                }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.85) 50%, transparent)' }} />
                <div className="noise-overlay" />

                <div style={{ position: 'relative', zIndex: 2, minHeight: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem 3rem' }}>
                    <div style={{ maxWidth: 500 }}>
                        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3.5rem,8vw,7rem)', color: '#fff', lineHeight: 0.9, letterSpacing: '0.02em' }}>
                            Connect &<br /><span style={{ color: '#7f1d1d' }}>Collaborate</span>
                        </h2>
                        <p style={{ color: '#ccc', marginTop: '1.5rem', lineHeight: 1.7, maxWidth: 380 }}>
                            Link up with driven people and make collaboration effortless.
                        </p>
                        <Link to="/signup">
                            <button className="cta-btn" style={{ background: 'linear-gradient(135deg,#f97316,#c2410c)', color: '#fff', marginTop: '2rem' }}>
                                Connect
                            </button>
                        </Link>
                    </div>

                    <div style={{ marginTop: '5rem', textAlign: 'center' }}>
                        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2rem,5vw,4rem)', color: '#fff', letterSpacing: '0.03em' }}>
                            Find. <span style={{ color: '#7f1d1d' }}>Match.</span> Link. Repeat.
                        </h3>
                        <p style={{ color: '#666', marginTop: '0.5rem' }}>Strong connections. Better teamwork.</p>
                    </div>
                </div>
            </Section>

            <div className="gradient-line" />

            {/* ══════════════════════ SWIPE + SKILL MATCHMAKING ══════════════════════ */}
            <section style={{ background: '#000', padding: '5rem 2rem', fontFamily: "'DM Sans', sans-serif" }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>

                    {/* Swipe to Match */}
                    <Section style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '2.5rem 2rem' }}>
                        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", color: '#fff', letterSpacing: '0.05em' }}>
                            <div style={{ fontSize: 'clamp(2rem,5vw,4rem)', lineHeight: 1 }}>Swipe</div>
                            <div style={{ fontSize: 'clamp(1.5rem,4vw,3rem)', color: '#888', lineHeight: 1 }}>To</div>
                            <div style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', color: '#7f1d1d', lineHeight: 1 }}>Match</div>
                        </h3>

                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                            <SwipeCard />
                        </div>

                        <p style={{ color: '#555', textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
                            Swipe Left to <span style={{ color: '#ef4444' }}>reject</span> and swipe right to <span style={{ color: '#22c55e' }}>connect</span>
                        </p>
                    </Section>

                    {/* Skill-Based Matchmaking */}
                    <Section style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '2.5rem 2rem' }}>
                        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", color: '#fff', letterSpacing: '0.05em', textAlign: 'right' }}>
                            <div style={{ fontSize: 'clamp(2rem,5vw,4rem)', lineHeight: 1 }}>Skill</div>
                            <div style={{ fontSize: 'clamp(1.5rem,4vw,3rem)', color: '#888', lineHeight: 1 }}>Based</div>
                            <div style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', color: '#7f1d1d', lineHeight: 1 }}>MatchMaking</div>
                        </h3>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                            <div>
                                <MiniProfileCard
                                    src="https://i.pinimg.com/474x/59/07/5c/59075c3183f3694b5cd432be62cb3370.jpg"
                                    name="Jade" sub="Vibe Coding & Gaming"
                                />
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span className="material-symbols-outlined" style={{ color: '#7f1d1d', fontSize: 36, animation: 'pulseGlow 2s ease-in-out infinite' }}>favorite</span>
                                </div>
                                <MiniProfileCard
                                    src="https://assets-prd.ignimgs.com/avatars/628784792d8e1600016d569e/download20211104112955-1653048478988.png"
                                    name="Joe" sub="Tech & Programming"
                                />
                            </div>
                        </div>

                        <p style={{ color: '#555', textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
                            Connect with people with the same <span style={{ color: '#22c55e' }}>interests</span>
                        </p>
                    </Section>

                    {/* Real-Time Chat */}
                    <Section style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '2.5rem 2rem' }}>
                        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", color: '#fff', letterSpacing: '0.05em' }}>
                            <div style={{ fontSize: 'clamp(2rem,5vw,4rem)', lineHeight: 1 }}>Real</div>
                            <div style={{ fontSize: 'clamp(1.5rem,4vw,3rem)', color: '#888', lineHeight: 1 }}>Time</div>
                            <div style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', color: '#7f1d1d', lineHeight: 1 }}>Chat</div>
                        </h3>
                        <ChatPreview />
                    </Section>

                </div>
            </section>

            <div className="gradient-line" />

            {/* ══════════════════════ GLOBAL COMMUNITY ══════════════════════ */}
            <Section style={{ background: '#000', padding: '5rem 2rem', fontFamily: "'DM Sans', sans-serif", textAlign: 'center' }}>
                <p style={{ color: '#f97316', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.2em', fontSize: '0.9rem', marginBottom: '0.75rem' }}>WORLDWIDE</p>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3rem,7vw,6rem)', color: '#fff', letterSpacing: '0.02em', lineHeight: 1 }}>
                    Global <span style={{ color: '#7f1d1d' }}>Community</span>
                </h2>
                <p style={{ color: '#555', marginTop: '0.75rem', marginBottom: '3rem' }}>Join thousands of skilled people across the globe</p>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden', maxWidth: 700, width: '100%', position: 'relative' }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, #000)', zIndex: 1, pointerEvents: 'none' }} />
                        <img
                            src="https://wallpapers.com/images/hd/cartoon-rappers-e3pacrziynupxdyf.jpg"
                            alt="Global Community Map"
                            style={{ width: '100%', display: 'block', opacity: 0.7 }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginTop: '3rem', flexWrap: 'wrap' }}>
                    {[['1k+', 'Users'], ['50+', 'Skills'], ['98%', 'Match Rate']].map(([num, lbl]) => (
                        <div key={lbl} style={{ textAlign: 'center' }}>
                            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', color: '#f97316', letterSpacing: '0.05em' }}>{num}</div>
                            <div style={{ color: '#555', fontSize: '0.8rem', marginTop: 2 }}>{lbl}</div>
                        </div>
                    ))}
                </div>
            </Section>

            <div className="gradient-line" />

            {/* ══════════════════════ CTA BANNER ══════════════════════ */}
            <section style={{
                background: 'linear-gradient(135deg, #1a0000 0%, #000 50%, #1a0500 100%)',
                padding: '6rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden',
                fontFamily: "'DM Sans', sans-serif",
            }}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(127,29,29,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div className="noise-overlay" />
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3rem,8vw,6rem)', color: '#fff', letterSpacing: '0.03em', lineHeight: 0.95 }}>
                        Your next great <br /><span style={{ color: '#7f1d1d' }}>collab</span> awaits.
                    </h2>
                    <p style={{ color: '#666', marginTop: '1.5rem', marginBottom: '2.5rem' }}>Stop searching. Start connecting.</p>
                    <Link to="/signup">
                        <button className="cta-btn" style={{ background: 'linear-gradient(135deg,#f97316,#c2410c)', color: '#fff', fontSize: '1.1rem', padding: '0.9rem 3rem' }}>
                            Get Started Free
                        </button>
                    </Link>
                </div>
            </section>

            <Footer />
        </>
    )
}

// ── Swipe card with gesture animation ──
function SwipeCard() {
    const [state, setState] = useState('idle') // idle | left | right
    const reset = () => setState('idle')

    const cardStyle = {
        background: 'rgba(10,10,10,0.95)',
        border: '1px solid rgba(156,163,175,0.25)',
        borderRadius: 16, padding: '1rem', width: 200,
        transition: 'transform 0.4s cubic-bezier(.4,0,.2,1), opacity 0.4s',
        transform: state === 'left' ? 'translateX(-120%) rotate(-15deg)' : state === 'right' ? 'translateX(120%) rotate(15deg)' : 'none',
        opacity: state !== 'idle' ? 0 : 1,
    }

    useEffect(() => {
        if (state !== 'idle') { const t = setTimeout(reset, 600); return () => clearTimeout(t) }
    }, [state])

    return (
        <div style={{ position: 'relative' }}>
            <div style={cardStyle}>
                <img src="https://preview.redd.it/huey-riley-v0-jefvnkclrbz91.jpg?width=640&crop=smart&auto=webp&s=448475c181c2c2ab12d30a12fdd774d27c765e70"
                    alt="Anonymous" style={{ width: '100%', borderRadius: 10, objectFit: 'cover', height: 160 }} />
                <h4 style={{ color: '#fff', textAlign: 'center', fontWeight: 800, marginTop: 8, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em' }}>Anonymous</h4>
                <p style={{ color: '#888', textAlign: 'center', fontSize: '0.75rem', marginTop: 2 }}>You need two brains to beat me in Chess</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                    <button onClick={() => setState('left')} style={{
                        width: 44, height: 44, borderRadius: 10, border: '1.5px solid #ef4444', background: 'transparent', color: '#ef4444',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background 0.2s',
                    }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.12)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
                    </button>
                    <button onClick={() => setState('right')} style={{
                        width: 44, height: 44, borderRadius: 10, border: '1.5px solid #22c55e', background: 'transparent', color: '#22c55e',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background 0.2s',
                    }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(34,197,94,0.12)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>check</span>
                    </button>
                </div>
            </div>
            {state === 'left' && <div style={{ position: 'absolute', top: 8, left: 8, color: '#ef4444', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', letterSpacing: '0.1em', border: '2px solid #ef4444', padding: '0.1rem 0.5rem', borderRadius: 6 }}>NOPE</div>}
            {state === 'right' && <div style={{ position: 'absolute', top: 8, right: 8, color: '#22c55e', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', letterSpacing: '0.1em', border: '2px solid #22c55e', padding: '0.1rem 0.5rem', borderRadius: 6 }}>LIKE</div>}
        </div>
    )
}

// ── Mini profile card ──
interface MiniProfileCardProps {
    src: string;
    name: string;
    sub: string;
}

function MiniProfileCard({
    src,
    name,
    sub,
}: MiniProfileCardProps): React.ReactElement {
    return (
        <div
            style={{
                background: "rgba(10,10,10,0.9)",
                border: "1px solid rgba(156,163,175,0.2)",
                borderRadius: 14,
                padding: "0.75rem",
                width: 130,
                transition: "border-color 0.3s, transform 0.3s",
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                e.currentTarget.style.borderColor = "#f97316";
                e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                e.currentTarget.style.borderColor =
                    "rgba(156,163,175,0.2)";
                e.currentTarget.style.transform = "none";
            }}
        >
            <img
                src={src}
                alt={name}
                style={{
                    width: "100%",
                    height: 100,
                    objectFit: "cover",
                    borderRadius: 10,
                }}
            />

            <h4
                style={{
                    color: "#fff",
                    textAlign: "center",
                    fontWeight: 800,
                    marginTop: 6,
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1rem",
                    letterSpacing: "0.05em",
                }}
            >
                {name}
            </h4>

            <p
                style={{
                    color: "#888",
                    textAlign: "center",
                    fontSize: "0.7rem",
                    marginTop: 2,
                }}
            >
                {sub}
            </p>

            <button
                style={{
                    marginTop: 8,
                    width: "100%",
                    padding: "0.3rem",
                    borderRadius: 999,
                    background:
                        "linear-gradient(135deg,#f97316,#c2410c)",
                    color: "#fff",
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                }}
            >
                Chat
            </button>
        </div>
    );
}

// ── Chat preview ──
function ChatPreview() {
    const messages = [
        { text: "Hey! bro i like your pfp", fromMe: true },
        { text: "And we got same interests", fromMe: true },
        { text: "Thanks bro", fromMe: false },
        { text: "Lets collaborate", fromMe: false },
    ]
    return (
        <div style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1rem', marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <img src="https://preview.redd.it/huey-riley-v0-jefvnkclrbz91.jpg?width=640&crop=smart&auto=webp&s=448475c181c2c2ab12d30a12fdd774d27c765e70" alt="pfp" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                <span style={{ color: '#fff', fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>Joe</span>
                <span style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: '#22c55e', animation: 'blink 1.4s infinite' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {messages.map((m, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: m.fromMe ? 'flex-end' : 'flex-start', animationDelay: `${i * 0.15}s` }}>
                        <span style={{
                            background: m.fromMe ? 'linear-gradient(135deg,rgba(249,115,22,0.25),rgba(194,65,12,0.2))' : 'rgba(255,255,255,0.07)',
                            color: '#ddd', padding: '0.45rem 0.85rem', borderRadius: 10, fontSize: '0.8rem',
                            border: `1px solid ${m.fromMe ? 'rgba(249,115,22,0.2)' : 'rgba(255,255,255,0.06)'}`,
                            maxWidth: '80%',
                        }}>{m.text}</span>
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: '1rem' }}>
                <input type="text" placeholder="Type a message…" style={{
                    flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 999, padding: '0.5rem 1rem', color: '#fff', fontSize: '0.8rem',
                    outline: 'none', fontFamily: "'DM Sans', sans-serif",
                }} />
                <button style={{ background: 'linear-gradient(135deg,#f97316,#c2410c)', border: 'none', borderRadius: '50%', width: 36, height: 36, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>send</span>
                </button>
            </div>
        </div>
    )
}

export default Landing
import React, { use, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";

interface LoginResponse {
    message?: string;
}

interface LoginForm {
    email: string;
    password: string;
}

const Login = (): React.ReactElement => {
    const navigate = useNavigate();

    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [focused, setFocused] = useState<string>("");
    const [form, setForm] = useState<LoginForm>({ email: "", password: "" });

    // Forgot password state
    const [showForgot, setShowForgot] = useState<boolean>(false);
    const [forgotEmail, setForgotEmail] = useState<string>("");
    const [forgotLoading, setForgotLoading] = useState<boolean>(false);
    const [forgotError, setForgotError] = useState<string>("");
    const [forgotSuccess, setForgotSuccess] = useState<boolean>(false);
    const [forgotFocused, setForgotFocused] = useState<boolean>(false);


    const submitLock = useRef<boolean>(false);
    const forgotLock = useRef<boolean>(false);

    function onchange(e: React.ChangeEvent<HTMLInputElement>): void {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const openForgot = () => {
        setForgotEmail("");
        setForgotError("");
        setForgotSuccess(false);
        setShowForgot(true);
    };

    const closeForgot = () => {
        if (forgotLoading) return;
        setShowForgot(false);
    };

    async function submitForgot(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        if (forgotLock.current) return;

        const email = forgotEmail.trim();
        if (!email) {
            setForgotError("Please enter your email address.");
            return;
        }

        forgotLock.current = true;
        setForgotLoading(true);
        setForgotError("");

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Something went wrong.");

            setForgotSuccess(true);


        } catch (err: unknown) {
            setForgotError(err instanceof Error ? err.message : "Request failed. Try again.");
        } finally {
            forgotLock.current = false;
            setForgotLoading(false);
        }
    }

    async function submit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        if (submitLock.current) return;

        const email = form.email.trim();
        const password = form.password.trim();

        if (!email) { setError("Email is required"); return; }
        if (!password) { setError("Password is required"); return; }

        submitLock.current = true;
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data: LoginResponse = await res.json();
            if (!res.ok) throw new Error(data.message || "Login failed");
            setForm({ email: "", password: "" });
            navigate("/explore");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Login failed. Try again.");
        } finally {
            submitLock.current = false;
            setLoading(false);
        }
    }

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;700&display=swap');
        * { box-sizing: border-box; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          from { background-position: -200% center; }
          to   { background-position: 200% center; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.94) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes overlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .login-card { animation: fadeUp 0.7s cubic-bezier(.16,1,.3,1) both; }
        .login-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 1rem 1.1rem;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
        }
        .login-input::placeholder { color: #555; }
        .login-input:hover { border-color: rgba(255,255,255,0.2); }
        .login-input:focus {
          border-color: #f97316;
          background: rgba(249,115,22,0.05);
          box-shadow: 0 0 0 3px rgba(249,115,22,0.12);
        }
        .login-input:-webkit-autofill,
        .login-input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px #111 inset;
          -webkit-text-fill-color: #fff;
        }
        .submit-btn {
          width: 100%; padding: 0.9rem; border-radius: 12px; border: none;
          font-family: 'DM Sans', sans-serif; font-weight: 800; font-size: 1rem;
          cursor: pointer; position: relative; overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s; color: #fff;
        }
        .submit-btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(37,99,235,0.45);
        }
        .submit-btn:not(:disabled):active { transform: translateY(0); }
        .submit-btn::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%);
          background-size: 200% auto; opacity: 0; transition: opacity 0.3s;
        }
        .submit-btn:not(:disabled):hover::after {
          opacity: 1; animation: shimmer 0.6s linear;
        }
        .forgot-btn {
          background: none; border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem; cursor: pointer;
          transition: color 0.2s; padding: 0;
        }
        .forgot-btn:hover { color: #2563eb !important; }
        .gradient-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(249,115,22,0.4), rgba(153,27,27,0.4), transparent);
        }
        .noise-overlay {
          position: absolute; inset: 0; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.4; border-radius: inherit;
        }
        .field-label {
          font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 600;
          letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 0.5rem;
          display: block; transition: color 0.25s;
        }
        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
          border-radius: 50%; animation: spin 0.7s linear infinite;
          display: inline-block; vertical-align: middle; margin-right: 8px;
        }

        /* Modal */
        .modal-overlay {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(0,0,0,0.75);
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          padding: 1.5rem;
          animation: overlayIn 0.25s ease both;
        }
        .modal-card {
          width: 100%; max-width: 440px;
          background: #0d0d0d;
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 20px;
          padding: 2.25rem 2rem;
          position: relative;
          animation: modalIn 0.35s cubic-bezier(.16,1,.3,1) both;
          box-shadow: 0 32px 80px rgba(0,0,0,0.6);
        }
        .modal-close-btn {
          position: absolute; top: 1rem; right: 1rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px; width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #666; transition: all 0.2s;
        }
        .modal-close-btn:hover {
          background: rgba(255,255,255,0.1); color: #fff;
        }
        .forgot-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 0.9rem 1rem 0.9rem 2.6rem;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
        }
        .forgot-input::placeholder { color: #555; }
        .forgot-input:focus {
          border-color: #f97316;
          background: rgba(249,115,22,0.05);
          box-shadow: 0 0 0 3px rgba(249,115,22,0.12);
        }
        .forgot-input:-webkit-autofill,
        .forgot-input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px #0d0d0d inset;
          -webkit-text-fill-color: #fff;
        }
        .next-btn {
          width: 100%; padding: 0.9rem; border-radius: 12px; border: none;
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: #fff; font-family: 'DM Sans', sans-serif;
          font-weight: 800; font-size: 1rem; cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
          position: relative; overflow: hidden;
        }
        .next-btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(249,115,22,0.4);
        }
        .next-btn:not(:disabled):active { transform: translateY(0); }
        .next-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .success-icon-wrap {
          width: 56px; height: 56px; border-radius: 50%;
          background: rgba(34,197,94,0.1);
          border: 1px solid rgba(34,197,94,0.25);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.25rem;
        }
      `}</style>

            <div style={{ background: '#000', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", position: 'relative', overflow: 'hidden' }}>

                {/* Ambient blobs */}
                <div style={{ position: 'fixed', top: '10%', left: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(153,27,27,0.12) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />
                <div style={{ position: 'fixed', bottom: '10%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />

                {/* Grid */}
                <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none', zIndex: 0 }} />

                <Navbar />

                <main style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '6rem 1.5rem 3rem' }}>
                    <div className="login-card" style={{ width: '100%', maxWidth: 480 }}>

                        {/* Header */}
                        <div style={{ textAlign: 'center', marginBottom: '2.5rem', animation: 'fadeUp 0.7s 0.05s both' }}>
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                padding: '0.35rem 1rem', borderRadius: 999,
                                border: '1px solid rgba(249,115,22,0.3)',
                                background: 'rgba(249,115,22,0.07)',
                                color: '#fb923c', fontSize: '0.78rem',
                                marginBottom: '1.25rem', letterSpacing: '0.05em',
                            }}>
                                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                                Secure Login
                            </div>
                            <h1 style={{
                                fontFamily: "'Bebas Neue', sans-serif",
                                fontSize: 'clamp(2.5rem, 6vw, 3.8rem)',
                                color: '#7f1d1d', letterSpacing: '0.03em', lineHeight: 1,
                            }}>
                                Welcome Back
                            </h1>
                            <p style={{ color: '#555', marginTop: '0.6rem', fontSize: '0.9rem' }}>
                                Sign in to your Swivvy account.{' '}
                                <Link to="/signup" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 600, transition: 'color 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#2563eb'}
                                    onMouseLeave={e => e.currentTarget.style.color = '#3b82f6'}
                                >
                                    Not a user?
                                </Link>
                            </p>
                        </div>

                        {/* Card */}
                        <div style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.07)',
                            borderRadius: 20, padding: '2.5rem 2rem',
                            position: 'relative', animation: 'fadeUp 0.7s 0.15s both',
                        }}>
                            <div className="noise-overlay" />
                            <form onSubmit={submit} style={{ position: 'relative', zIndex: 1 }}>

                                {/* Email */}
                                <div style={{ marginBottom: '1.25rem', animation: 'fadeUp 0.7s 0.25s both' }}>
                                    <label className="field-label" style={{ color: focused === 'email' ? '#f97316' : '#666' }}>Email</label>
                                    <div style={{ position: 'relative' }}>
                                        <span className="material-symbols-outlined" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: focused === 'email' ? '#f97316' : '#444', transition: 'color 0.25s', pointerEvents: 'none' }}>mail</span>
                                        <input type="email" name="email" placeholder="joe@example.com" className="login-input" value={form.email} onChange={onchange} onFocus={() => setFocused('email')} onBlur={() => setFocused('')} style={{ paddingLeft: '2.6rem' }} />
                                    </div>
                                </div>

                                {/* Password */}
                                <div style={{ marginBottom: '0.5rem', animation: 'fadeUp 0.7s 0.35s both' }}>
                                    <label className="field-label" style={{ color: focused === 'password' ? '#f97316' : '#666' }}>Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <span className="material-symbols-outlined" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: focused === 'password' ? '#f97316' : '#444', transition: 'color 0.25s', pointerEvents: 'none' }}>lock</span>
                                        <input type="password" name="password" placeholder="••••••••" className="login-input" value={form.password} onChange={onchange} onFocus={() => setFocused('password')} onBlur={() => setFocused('')} style={{ paddingLeft: '2.6rem' }} />
                                    </div>
                                </div>

                                {/* Forgot password trigger */}
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.75rem', animation: 'fadeUp 0.7s 0.4s both' }}>
                                    <button type="button" className="forgot-btn" style={{ color: '#3b82f6' }} onClick={openForgot}>
                                        Forgotten your password?
                                    </button>
                                </div>

                                {/* Error */}
                                {error && (
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: 8,
                                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                                        borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1.25rem',
                                        animation: 'fadeUp 0.4s both',
                                    }}>
                                        <span className="material-symbols-outlined" style={{ color: '#ef4444', fontSize: 18 }}>error</span>
                                        <p style={{ color: '#ef4444', fontSize: '0.85rem', margin: 0 }}>{error}</p>
                                    </div>
                                )}

                                {/* Submit */}
                                <div style={{ animation: 'fadeUp 0.7s 0.45s both' }}>
                                    <button type="submit" disabled={loading} className="submit-btn" style={{ background: loading ? 'rgba(107,114,128,0.5)' : 'linear-gradient(135deg, #2563eb, #1d4ed8)', cursor: loading ? 'not-allowed' : 'pointer' }}>
                                        {loading ? (<><span className="spinner" />Logging in…</>) : 'Login'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Divider */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.75rem 0', animation: 'fadeUp 0.7s 0.55s both' }}>
                            <div className="gradient-line" style={{ flex: 1 }} />
                            <span style={{ color: '#333', fontSize: '0.75rem', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap' }}>OR CONTINUE WITH</span>
                            <div className="gradient-line" style={{ flex: 1 }} />
                        </div>

                        {/* Social stubs */}
                        <div style={{ display: 'flex', gap: '0.75rem', animation: 'fadeUp 0.7s 0.6s both' }}>
                            {[{ icon: 'G', label: 'Google', color: '#ea4335' }, { icon: 'GH', label: 'GitHub', color: '#aaa' }].map(({ icon, label, color }) => (
                                <button key={label} style={{
                                    flex: 1, padding: '0.75rem', borderRadius: 12,
                                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                                    color: '#aaa', fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem',
                                    fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', gap: 8, transition: 'border-color 0.25s, background 0.25s, transform 0.2s',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.transform = 'none' }}
                                >
                                    <span style={{ fontWeight: 800, color, fontFamily: 'monospace' }}>{icon}</span>
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* Footer note */}
                        <p style={{ color: '#333', fontSize: '0.75rem', textAlign: 'center', marginTop: '2rem', lineHeight: 1.6, animation: 'fadeUp 0.7s 0.65s both' }}>
                            Your Swivvy Account information is used to sign you in securely and give you access to your profile, connections, and activity. Swivvy may record certain data for security, support, and reporting purposes.
                        </p>
                    </div>
                </main>
            </div>

            {/* ── Forgot Password Modal ── */}
            {showForgot && (
                <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeForgot(); }}>
                    <div className="modal-card">
                        <div className="noise-overlay" />

                        {/* Close button */}
                        <button className="modal-close-btn" onClick={closeForgot} type="button">
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
                        </button>

                        <div style={{ position: 'relative', zIndex: 1 }}>
                            {!forgotSuccess ? (
                                <>
                                    {/* Icon */}
                                    <div style={{
                                        width: 48, height: 48, borderRadius: 12,
                                        background: 'rgba(249,115,22,0.1)',
                                        border: '1px solid rgba(249,115,22,0.2)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        marginBottom: '1.25rem',
                                    }}>
                                        <span className="material-symbols-outlined" style={{ color: '#f97316', fontSize: 22 }}>lock_reset</span>
                                    </div>

                                    <h2 style={{
                                        fontFamily: "'Bebas Neue', sans-serif",
                                        fontSize: '2rem', color: '#fff',
                                        letterSpacing: '0.03em', marginBottom: '0.4rem', lineHeight: 1,
                                    }}>
                                        Reset Password
                                    </h2>
                                    <p style={{ color: '#555', fontSize: '0.88rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
                                        Enter the email linked to your Swivvy account and we'll send you a reset link.
                                    </p>

                                    <form onSubmit={submitForgot}>
                                        <label className="field-label" style={{ color: forgotFocused ? '#f97316' : '#666', marginBottom: '0.5rem', display: 'block' }}>
                                            Email Address
                                        </label>
                                        <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
                                            <span className="material-symbols-outlined" style={{
                                                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                                                fontSize: 18, color: forgotFocused ? '#f97316' : '#444',
                                                transition: 'color 0.25s', pointerEvents: 'none',
                                            }}>mail</span>
                                            <input
                                                type="email"
                                                placeholder="joe@example.com"
                                                className="forgot-input"
                                                value={forgotEmail}
                                                onChange={e => setForgotEmail(e.target.value)}
                                                onFocus={() => setForgotFocused(true)}
                                                onBlur={() => setForgotFocused(false)}
                                                autoFocus
                                            />
                                        </div>

                                        {/* Error */}
                                        {forgotError && (
                                            <div style={{
                                                display: 'flex', alignItems: 'center', gap: 8,
                                                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                                                borderRadius: 10, padding: '0.65rem 0.9rem', marginBottom: '1.1rem',
                                            }}>
                                                <span className="material-symbols-outlined" style={{ color: '#ef4444', fontSize: 17 }}>error</span>
                                                <p style={{ color: '#ef4444', fontSize: '0.83rem', margin: 0 }}>{forgotError}</p>
                                            </div>
                                        )}



                                        <button type="submit" disabled={forgotLoading} className="next-btn">
                                            {forgotLoading ? (<><span className="spinner" />Sending…</>) : 'Next →'}
                                        </button>

                                        <button type="button" onClick={closeForgot} style={{
                                            width: '100%', marginTop: '0.75rem', padding: '0.75rem',
                                            borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)',
                                            background: 'transparent', color: '#555',
                                            fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem',
                                            cursor: 'pointer', transition: 'all 0.2s',
                                        }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#fff'; }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#555'; }}
                                        >
                                            Cancel
                                        </button>
                                    </form>
                                </>
                            ) : (
                                /* Success state */
                                <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
                                    <div className="success-icon-wrap">
                                        <span className="material-symbols-outlined" style={{ color: '#22c55e', fontSize: 26 }}>mark_email_read</span>
                                    </div>
                                    <h2 style={{
                                        fontFamily: "'Bebas Neue', sans-serif",
                                        fontSize: '1.9rem', color: '#fff',
                                        letterSpacing: '0.03em', marginBottom: '0.5rem', lineHeight: 1,
                                    }}>
                                        Check your inbox
                                    </h2>
                                    <p style={{ color: '#555', fontSize: '0.88rem', lineHeight: 1.65, marginBottom: '1.75rem' }}>
                                        We've sent a password reset link to <span style={{ color: '#f97316', fontWeight: 600 }}>{forgotEmail}</span>. The link expires in 15 minutes.
                                    </p>
                                    <button onClick={closeForgot} className="next-btn">
                                        Back to Login
                                    </button>
                                    <p style={{ color: '#444', fontSize: '0.78rem', marginTop: '1rem' }}>
                                        Didn't receive it?{' '}
                                        <button onClick={() => { setForgotSuccess(false); setForgotEmail(''); }} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', padding: 0 }}>
                                            Try again
                                        </button>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Login;
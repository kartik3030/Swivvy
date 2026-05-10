import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";


const COUNTRIES = [
    { value: "IN", label: "India" },
    { value: "US", label: "United States" },
    { value: "GB", label: "United Kingdom" },
    { value: "CA", label: "Canada" },
];

// Password strength checker
function getStrength(p) {
    let score = 0;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[a-z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score; // 0–5
}
const strengthLabel = ["", "Weak", "Weak", "Fair", "Good", "Strong"];
const strengthColor = ["", "#ef4444", "#ef4444", "#f97316", "#eab308", "#22c55e"];

const Signup = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        FName: "", LName: "", email: "", date: "",
        country: "", password: "", confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [focused, setFocused] = useState("");
    const submitLock = useRef(false);

    function onchange(e) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const validateForm = () => {
        if (form.FName.trim().length < 2) return "First name is too short";
        if (!form.LName.trim()) return "Last name is required";
        if (!form.email.trim()) return "Email is required";
        if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Invalid email address";
        if (!form.date) return "Date of birth is required";
        if (!form.country) return "Country is required";
        const p = form.password;
        if (p.length < 10 || !/[A-Z]/.test(p) || !/[a-z]/.test(p) || !/[0-9]/.test(p))
            return "Password must be at least 10 chars, include uppercase, lowercase, and a number";
        if (p !== form.confirmPassword) return "Passwords must match";
        return null;
    };

    async function submit(e) {
        e.preventDefault();

        if (submitLock.current) return;

        const err = validateForm();
        if (err) {
            setError(err);
            return;
        }

        submitLock.current = true;
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/signup`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        FName: form.FName.trim(),
                        LName: form.LName.trim(),
                        email: form.email.trim().toLowerCase(),
                        date: form.date,
                        country: form.country,
                        password: form.password,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Signup failed");
            }

            setSuccess("Account created! Redirecting...");
            setTimeout(() => navigate("/login"), 1500);

        } catch (err) {
            setError(err.message || "Signup failed. Try again.");
        } finally {
            submitLock.current = false;
            setLoading(false);
        }
    }

    const pwStrength = getStrength(form.password);

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;600;700&display=swap');
        * { box-sizing: border-box; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%,100% { opacity: 1; }
          50%      { opacity: 0; }
        }
        @keyframes shimmer {
          from { background-position: -200% center; }
          to   { background-position:  200% center; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .su-input, .su-select {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 0.9rem 1rem 0.9rem 2.7rem;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.92rem;
          outline: none;
          transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
          appearance: none;
        }
        .su-select option { background: #111; color: #fff; }
        .su-input::placeholder { color: #444; }
        .su-input:hover, .su-select:hover { border-color: rgba(255,255,255,0.18); }
        .su-input:focus, .su-select:focus {
          border-color: #f97316;
          background: rgba(249,115,22,0.05);
          box-shadow: 0 0 0 3px rgba(249,115,22,0.12);
        }
        .su-input:-webkit-autofill,
        .su-input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px #111 inset;
          -webkit-text-fill-color: #fff;
        }
        .su-input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1) opacity(0.4);
          cursor: pointer;
        }

        .su-label {
          display: block;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 0.45rem;
          transition: color 0.25s;
        }

        .su-btn {
          width: 100%; padding: 0.95rem;
          border-radius: 12px; border: none;
          font-family: 'DM Sans', sans-serif;
          font-weight: 800; font-size: 1rem;
          cursor: pointer; color: #fff;
          position: relative; overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .su-btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(37,99,235,0.45);
        }
        .su-btn::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%);
          background-size: 200% auto;
          opacity: 0; transition: opacity 0.3s;
        }
        .su-btn:not(:disabled):hover::after {
          opacity: 1; animation: shimmer 0.6s linear;
        }

        .spinner {
          width: 17px; height: 17px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block; vertical-align: middle;
          margin-right: 8px;
        }
        .gradient-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(249,115,22,0.4), rgba(153,27,27,0.4), transparent);
        }
        .noise-overlay {
          position: absolute; inset: 0; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.4; border-radius: inherit;
        }
        .pw-bar-seg {
          height: 3px; border-radius: 99px; flex: 1;
          transition: background 0.35s;
        }
        .step-badge {
          width: 22px; height: 22px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.7rem; font-weight: 800;
          font-family: 'DM Sans', sans-serif;
          flex-shrink: 0;
        }
      `}</style>

            <div style={{ background: '#000', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", position: 'relative', overflow: 'hidden' }}>

                {/* ambient blobs */}
                <div style={{ position: 'fixed', top: '5%', left: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(153,27,27,0.12) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />
                <div style={{ position: 'fixed', bottom: '5%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />

                {/* grid */}
                <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none', zIndex: 0 }} />

                <Navbar />

                <main style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', padding: '7rem 1.5rem 4rem' }}>
                    <div style={{ width: '100%', maxWidth: 520, animation: 'fadeUp 0.7s cubic-bezier(.16,1,.3,1) both' }}>

                        {/* Header */}
                        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                padding: '0.35rem 1rem', borderRadius: 999,
                                border: '1px solid rgba(249,115,22,0.3)',
                                background: 'rgba(249,115,22,0.07)',
                                color: '#fb923c', fontSize: '0.78rem', marginBottom: '1.25rem', letterSpacing: '0.05em',
                            }}>
                                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'blink 1.4s ease-in-out infinite' }} />
                                Free to join
                            </div>

                            <h1 style={{
                                fontFamily: "'Bebas Neue', sans-serif",
                                fontSize: 'clamp(2.5rem, 6vw, 3.8rem)',
                                color: '#7f1d1d', letterSpacing: '0.03em', lineHeight: 1,
                            }}>
                                Create Your Account
                            </h1>
                            <p style={{ color: '#555', marginTop: '0.6rem', fontSize: '0.9rem' }}>
                                Already registered?{' '}
                                <Link to="/login" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#2563eb'}
                                    onMouseLeave={e => e.currentTarget.style.color = '#3b82f6'}
                                >Login</Link>
                            </p>
                        </div>

                        {/* Card */}
                        <div style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.07)',
                            borderRadius: 20, padding: '2.5rem 2rem',
                            position: 'relative',
                        }}>
                            <div className="noise-overlay" />

                            {/* Section label */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
                                <span className="step-badge" style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316' }}>1</span>
                                <span style={{ color: '#555', fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>Personal Info</span>
                                <div className="gradient-line" style={{ flex: 1 }} />
                            </div>

                            <form onSubmit={submit} style={{ position: 'relative', zIndex: 1 }}>

                                {/* Name row */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem', animation: 'fadeUp 0.6s 0.1s both' }}>
                                    {[
                                        { name: 'FName', label: 'First Name', icon: 'badge', placeholder: 'Joe' },
                                        { name: 'LName', label: 'Last Name', icon: 'badge', placeholder: 'Doe' },
                                    ].map(({ name, label, icon, placeholder }) => (
                                        <div key={name}>
                                            <label className="su-label" style={{ color: focused === name ? '#f97316' : '#555' }}>{label}</label>
                                            <div style={{ position: 'relative' }}>
                                                <span className="material-symbols-outlined" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: focused === name ? '#f97316' : '#333', transition: 'color 0.25s', pointerEvents: 'none' }}>{icon}</span>
                                                <input type="text" name={name} value={form[name]} onChange={onchange} placeholder={placeholder}
                                                    className="su-input" onFocus={() => setFocused(name)} onBlur={() => setFocused('')} />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Email */}
                                <Field name="email" label="Email" icon="mail" type="email" placeholder="joe@example.com"
                                    value={form.email} onChange={onchange} focused={focused} setFocused={setFocused} delay="0.15s" />

                                {/* DOB + Country row */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', margin: '1rem 0', animation: 'fadeUp 0.6s 0.2s both' }}>
                                    <div>
                                        <label className="su-label" style={{ color: focused === 'date' ? '#f97316' : '#555' }}>Date of Birth</label>
                                        <div style={{ position: 'relative' }}>
                                            <span className="material-symbols-outlined" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: focused === 'date' ? '#f97316' : '#333', transition: 'color 0.25s', pointerEvents: 'none' }}>cake</span>
                                            <input type="date" name="date" value={form.date} onChange={onchange}
                                                className="su-input" onFocus={() => setFocused('date')} onBlur={() => setFocused('')} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="su-label" style={{ color: focused === 'country' ? '#f97316' : '#555' }}>Country</label>
                                        <div style={{ position: 'relative' }}>
                                            <span className="material-symbols-outlined" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: focused === 'country' ? '#f97316' : '#333', transition: 'color 0.25s', pointerEvents: 'none', zIndex: 1 }}>public</span>
                                            <select name="country" value={form.country} onChange={onchange}
                                                className="su-select" onFocus={() => setFocused('country')} onBlur={() => setFocused('')}>
                                                <option value="">Select…</option>
                                                {COUNTRIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                            </select>
                                            <span className="material-symbols-outlined" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: '#444', pointerEvents: 'none' }}>expand_more</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Section divider */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '1.75rem 0 1.25rem' }}>
                                    <span className="step-badge" style={{ background: 'rgba(37,99,235,0.15)', color: '#3b82f6' }}>2</span>
                                    <span style={{ color: '#555', fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>Security</span>
                                    <div className="gradient-line" style={{ flex: 1 }} />
                                </div>

                                {/* Password */}
                                <div style={{ marginBottom: '1rem', animation: 'fadeUp 0.6s 0.25s both' }}>
                                    <label className="su-label" style={{ color: focused === 'password' ? '#f97316' : '#555' }}>Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <span className="material-symbols-outlined" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: focused === 'password' ? '#f97316' : '#333', transition: 'color 0.25s', pointerEvents: 'none' }}>lock</span>
                                        <input type="password" name="password" value={form.password} onChange={onchange}
                                            placeholder="Min. 10 chars" className="su-input"
                                            onFocus={() => setFocused('password')} onBlur={() => setFocused('')} />
                                    </div>
                                    {/* Strength bar */}
                                    {form.password.length > 0 && (
                                        <div style={{ marginTop: '0.5rem', animation: 'slideIn 0.3s both' }}>
                                            <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <div key={i} className="pw-bar-seg"
                                                        style={{ background: i <= pwStrength ? strengthColor[pwStrength] : 'rgba(255,255,255,0.08)' }} />
                                                ))}
                                            </div>
                                            <span style={{ fontSize: '0.72rem', color: strengthColor[pwStrength], fontWeight: 600, letterSpacing: '0.04em' }}>
                                                {strengthLabel[pwStrength]}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div style={{ marginBottom: '1.75rem', animation: 'fadeUp 0.6s 0.3s both' }}>
                                    <label className="su-label" style={{ color: focused === 'confirmPassword' ? '#f97316' : '#555' }}>Confirm Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <span className="material-symbols-outlined" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: focused === 'confirmPassword' ? '#f97316' : '#333', transition: 'color 0.25s', pointerEvents: 'none' }}>lock_reset</span>
                                        <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={onchange}
                                            placeholder="Re-enter password" className="su-input"
                                            onFocus={() => setFocused('confirmPassword')} onBlur={() => setFocused('')} />
                                        {/* Match indicator */}
                                        {form.confirmPassword.length > 0 && (
                                            <span className="material-symbols-outlined" style={{
                                                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                                                fontSize: 18,
                                                color: form.password === form.confirmPassword ? '#22c55e' : '#ef4444',
                                                transition: 'color 0.3s',
                                            }}>
                                                {form.password === form.confirmPassword ? 'check_circle' : 'cancel'}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Error */}
                                {error && (
                                    <div style={{
                                        display: 'flex', alignItems: 'flex-start', gap: 8,
                                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                                        borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1.25rem',
                                        animation: 'fadeUp 0.4s both',
                                    }}>
                                        <span className="material-symbols-outlined" style={{ color: '#ef4444', fontSize: 18, flexShrink: 0, marginTop: 1 }}>error</span>
                                        <p style={{ color: '#ef4444', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>{error}</p>
                                    </div>
                                )}

                                {/* Success */}
                                {success && (
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: 8,
                                        background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)',
                                        borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1.25rem',
                                        animation: 'fadeUp 0.4s both',
                                    }}>
                                        <span className="material-symbols-outlined" style={{ color: '#22c55e', fontSize: 18 }}>check_circle</span>
                                        <p style={{ color: '#22c55e', fontSize: '0.85rem', margin: 0 }}>{success}</p>
                                    </div>
                                )}

                                {/* Submit */}
                                <button type="submit" disabled={loading} className="su-btn"
                                    style={{ background: loading ? 'rgba(107,114,128,0.5)' : 'linear-gradient(135deg,#2563eb,#1d4ed8)', cursor: loading ? 'not-allowed' : 'pointer' }}>
                                    {loading ? <><span className="spinner" />Creating account…</> : 'Create Account'}
                                </button>

                            </form>
                        </div>

                        {/* Footer note */}
                        <p style={{ color: '#2a2a2a', fontSize: '0.72rem', textAlign: 'center', marginTop: '1.75rem', lineHeight: 1.6 }}>
                            By creating an account you agree to Swivvy's Terms of Service and Privacy Policy. Your data is used solely to personalise your experience.
                        </p>
                    </div>
                </main>
            </div>
        </>
    );
};

// ── Reusable field ──
function Field({ name, label, icon, type, placeholder, value, onChange, focused, setFocused, delay }) {
    return (
        <div style={{ marginBottom: '1rem', animation: `fadeUp 0.6s ${delay} both` }}>
            <label className="su-label" style={{ color: focused === name ? '#f97316' : '#555' }}>{label}</label>
            <div style={{ position: 'relative' }}>
                <span className="material-symbols-outlined" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: focused === name ? '#f97316' : '#333', transition: 'color 0.25s', pointerEvents: 'none' }}>{icon}</span>
                <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
                    className="su-input" onFocus={() => setFocused(name)} onBlur={() => setFocused('')} />
            </div>
        </div>
    );
}

export default Signup;
import React, { useState, useEffect } from "react";
import Navbar2 from "../component/Navbar2";
import { useNavigate } from "react-router-dom";

/* ================= IMAGE RESOLVER ================= */

const resolveImage = (path) => {
    if (!path) {
        return "https://i.pinimg.com/474x/3d/8d/b1/3d8db18cc50c15523a13908a593a480c.jpg";
    }
    if (path.startsWith("http")) return path;
    if (path.startsWith("/uploads")) {
        return `${import.meta.env.VITE_API_URL}${path}`;
    }
    return "https://i.pinimg.com/474x/3d/8d/b1/3d8db18cc50c15523a13908a593a480c.jpg";
};

const EditProfile = () => {
    const navigate = useNavigate();

    const [disable, setDisable] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [backendData, setBackendData] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [preview, setPreview] = useState(null);
    const [newSkill, setNewSkill] = useState("");
    const [fileName, setFileName] = useState("");

    const [form, editForm] = useState({
        profilePhoto: null,
        FName: "",
        LName: "",
        email: "",
        bio: "",
        country: "",
        skills: [],
    });

    /* ===== Normalize backend skills ===== */
    const normalizeSkills = (value) => {
        if (!value) return [];
        if (Array.isArray(value)) return value;
        if (typeof value === "string")
            return value.split(",").map((s) => s.trim());
        return [];
    };

    /* ===== Fetch logged-in user ===== */
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/me`,
                    { credentials: "include" }
                );
                if (!res.ok) throw new Error("Unauthorized");
                const data = await res.json();
                setBackendData(data);
                editForm({
                    profilePhoto: null,
                    FName: data.FName || "",
                    LName: data.LName || "",
                    email: data.email || "",
                    bio: data.bio || "",
                    country: data.country || "",
                    skills: normalizeSkills(data.skills),
                });
            } catch {
                navigate("/");
            }
        };
        fetchUser();
    }, [navigate]);

    /* ===== Input change ===== */
    function onChange(e) {
        const { name, value } = e.target;
        editForm((prev) => ({ ...prev, [name]: value }));
    }

    /* ===== Add Skill ===== */
    function addNewSkill() {
        const trim = newSkill.trim();
        if (!trim) return;
        editForm((prev) => {
            if (prev.skills.includes(trim)) {
                setError("Skill already added");
                return prev;
            }
            setError("");
            return { ...prev, skills: [...prev.skills, trim] };
        });
        setNewSkill("");
    }

    /* ===== Remove Skill ===== */
    function removeSkill(skill) {
        editForm((prev) => ({
            ...prev,
            skills: prev.skills.filter((s) => s !== skill),
        }));
    }

    /* ===== Submit ===== */
    async function submit(e) {
        e.preventDefault();
        if (!form.FName || !form.LName || !form.bio || form.skills.length === 0) {
            setError("All fields are required");
            return;
        }
        setDisable(true);
        setError("");
        setSuccessMsg("");
        try {
            const formData = new FormData();

            formData.append("FName", form.FName);
            formData.append("LName", form.LName);
            formData.append("bio", form.bio);
            formData.append("country", form.country);   // ADD THIS
            formData.append("email", form.email);

            form.skills.forEach((s) => formData.append("skills", s));

            if (form.profilePhoto) {
                formData.append("profilePhoto", form.profilePhoto);
            }

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/editProfile`,
                {
                    method: "PUT",
                    credentials: "include",
                    body: formData,
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Something went wrong while saving");
            }

            setSuccessMsg("Profile updated successfully!");
            setBackendData(data);
            setPreview(null);
            setFileName("");

        } catch (err) {
            setError(err.message || "Something went wrong while saving");
        } finally {
            setDisable(false);
        }
    }

    /* ===== File Preview ===== */
    const handleFileChange = (e) => {
        const file = e.target.files?.[0] || null;
        editForm((prev) => ({ ...prev, profilePhoto: file }));
        setPreview(file ? URL.createObjectURL(file) : null);
        setFileName(file ? file.name : "");
    };

    /* ===== Discard ===== */
    const handleDiscard = () => {
        if (backendData) {
            editForm({
                profilePhoto: null,
                FName: backendData.FName || "",
                LName: backendData.LName || "",
                bio: backendData.bio || "",
                skills: normalizeSkills(backendData.skills),
                email: backendData.email || "",
            });
        }
        setShowConfirm(false);
        setPreview(null);
        setFileName("");
        setError("");
        setSuccessMsg("");
    };

    /* ===== Loading ===== */
    if (!backendData) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <span className="text-sm text-gray-400 animate-pulse">Loading...</span>
            </div>
        );
    }

    /* ===== Render ===== */
    return (
        <div className="bg-black text-white min-h-screen pb-20">

            <header className="flex justify-center">
                <Navbar2 />
            </header>

            <main className="max-w-2xl mx-auto px-5">

                {/* ── Page Header ── */}
                <div
                    className="flex items-center justify-between mt-7 mb-5"
                    style={{ animation: "fadeUp .45s cubic-bezier(.22,.68,0,1.2) both" }}
                >
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
                        Edit Profile
                    </h1>
                </div>

                {/* ── Live Preview Card ── */}
                <div
                    className="flex gap-5 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md mb-4"
                    style={{ animation: "fadeUp .45s .05s cubic-bezier(.22,.68,0,1.2) both" }}
                >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        <img
                            src={preview || resolveImage(backendData.profilePhoto)}
                            alt="Profile preview"
                            className="w-24 h-[116px] rounded-[14px] object-cover block"
                        />
                        <div className="absolute inset-0 rounded-[14px] bg-gradient-to-b from-transparent via-transparent to-black/50 pointer-events-none" />

                    </div>

                    {/* Live-updating info */}
                    <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-bold truncate mb-1">
                            {form.FName || "Your Name"}
                        </h2>
                        <div className="flex items-center gap-3 flex-wrap mb-2">
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                                <span className="material-symbols-outlined text-[14px]">mail</span>
                                {form.email}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                                <span className="material-symbols-outlined text-[14px]">location_on</span>
                                {backendData.country || "India"}
                            </span>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed mb-3">{form.bio}</p>
                        <div className="flex gap-2 flex-wrap">
                            {form.skills.slice(0, 6).map((s, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-1 rounded-full border border-white/18 text-[11px] font-bold
                                        bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent"
                                >
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Form Card ── */}
                <form
                    onSubmit={submit}
                    className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-5 mb-5"
                    style={{ animation: "fadeUp .45s .15s cubic-bezier(.22,.68,0,1.2) both" }}
                >

                    {/* Section: Personal Info */}
                    <p className="flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">
                        <span className="material-symbols-outlined text-[15px] text-orange-500">person</span>
                        Personal info
                    </p>

                    {/* First + Last Name — side by side */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-gray-400 font-medium">First name</label>
                            <input
                                type="text"
                                name="FName"
                                value={form.FName}
                                onChange={onChange}
                                className="
                                    bg-white/6 border border-white/12 rounded-xl
                                    text-white text-sm px-3 py-2.5 outline-none
                                    transition-all duration-200
                                    focus:border-orange-500/50 focus:bg-orange-500/5
                                "
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-gray-400 font-medium">Last name</label>
                            <input
                                type="text"
                                name="LName"
                                value={form.LName}
                                onChange={onChange}
                                className="
                                    bg-white/6 border border-white/12 rounded-xl
                                    text-white text-sm px-3 py-2.5 outline-none
                                    transition-all duration-200
                                    focus:border-orange-500/50 focus:bg-orange-500/5
                                "
                            />
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="flex flex-col gap-1 mb-4">
                        <label className="text-xs text-gray-400 font-medium">Bio</label>
                        <textarea
                            name="bio"
                            value={form.bio}
                            onChange={onChange}
                            rows={3}
                            className="
                                bg-white/6 border border-white/12 rounded-xl
                                text-white text-sm px-3 py-2.5 outline-none resize-none
                                transition-all duration-200
                                focus:border-orange-500/50 focus:bg-orange-500/5
                            "
                        />
                    </div>

                    {/* Email — read only */}
                    <div className="flex flex-col gap-1 mb-5">
                        <label className="text-xs text-gray-400 font-medium">
                            Email <span className="text-gray-600 text-[10px]">(read-only)</span>
                        </label>
                        <input
                            type="email"
                            value={form.email}
                            readOnly
                            className="
                                bg-white/4 border border-white/8 rounded-xl
                                text-gray-500 text-sm px-3 py-2.5 outline-none cursor-default
                            "
                        />
                    </div>

                    <hr className="border-none border-t border-white/8 my-5" style={{ borderTopWidth: 1, borderColor: "rgba(255,255,255,.08)" }} />

                    {/* Section: Photo */}
                    <p className="flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">
                        <span className="material-symbols-outlined text-[15px] text-orange-500">photo_camera</span>
                        Profile photo
                    </p>

                    {/* Hidden file input */}
                    <input
                        type="file"
                        id="profile-photo-input"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    {/* Styled upload trigger */}
                    <label
                        htmlFor="profile-photo-input"
                        className="
                            flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer
                            bg-white/5 border border-dashed border-white/20
                            text-sm text-gray-400
                            transition-all duration-200
                            hover:bg-white/10 hover:border-orange-500/40 hover:text-white
                            mb-5
                        "
                    >
                        <span className="material-symbols-outlined text-[18px] text-orange-500">upload</span>
                        {fileName || "Choose a photo…"}
                    </label>

                    <hr className="border-none my-5" style={{ borderTopWidth: 1, borderColor: "rgba(255,255,255,.08)" }} />

                    {/* Section: Skills */}
                    <p className="flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">
                        <span className="material-symbols-outlined text-[15px] text-orange-500">code</span>
                        Skills
                    </p>

                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addNewSkill(); } }}
                            placeholder="e.g. Figma, Python…"
                            className="
                                flex-1 bg-white/6 border border-white/12 rounded-xl
                                text-white text-sm px-3 py-2.5 outline-none
                                transition-all duration-200
                                focus:border-orange-500/50 focus:bg-orange-500/5
                            "
                        />
                        <button
                            type="button"
                            onClick={addNewSkill}
                            className="
                                px-5 py-2.5 rounded-xl font-bold text-sm
                                bg-orange-500/15 border border-orange-500/30 text-orange-400
                                hover:bg-orange-500/25 transition-colors duration-200
                                active:scale-95
                            "
                        >
                            Add
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-5 min-h-[28px]">
                        {form.skills.map((skill, i) => (
                            <span
                                key={i}
                                className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/18 text-xs font-bold
                                    bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent"
                            >
                                {skill}
                                <button
                                    type="button"
                                    onClick={() => removeSkill(skill)}
                                    className="text-red-900 font-black text-sm leading-none hover:text-red-500 transition-colors"
                                    style={{ WebkitTextFillColor: "inherit" }}
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>

                    {/* Messages */}
                    {(error || successMsg) && (
                        <div className="text-center text-sm font-semibold mb-4">
                            {error && <p className="text-red-400">{error}</p>}
                            {successMsg && <p className="text-green-400">{successMsg}</p>}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setShowConfirm(true)}
                            className="
                                flex-1 py-3 rounded-full text-sm font-bold
                                bg-red-500/12 border border-red-500/30 text-red-400
                                hover:bg-red-500/22 transition-colors duration-200
                                active:scale-97
                            "
                        >
                            Discard
                        </button>
                        <button
                            type="submit"
                            disabled={disable}
                            className={`
                                flex-1 py-3 rounded-full text-sm font-bold text-white
                                transition-all duration-200 active:scale-97
                                ${disable
                                    ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                                    : "bg-gradient-to-r from-orange-500 to-orange-700 hover:opacity-88"
                                }
                            `}
                        >
                            {disable ? "Saving…" : "Save Changes"}
                        </button>
                    </div>
                </form>
            </main>

            {/* ── Discard Confirm Modal ── */}
            {showConfirm && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
                    style={{ animation: "fadeIn .2s both" }}
                    onClick={() => setShowConfirm(false)}
                >
                    <div
                        className="bg-[#111] border border-white/12 rounded-2xl p-7 w-[300px]"
                        style={{ animation: "scaleIn .25s cubic-bezier(.22,.68,0,1.2) both" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-[17px] font-semibold text-center mb-1">
                            Discard changes?
                        </h3>
                        <p className="text-sm text-gray-400 text-center mb-6">
                            All unsaved edits will be lost.
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
                                No, keep
                            </button>
                            <button
                                onClick={handleDiscard}
                                className="
                                    flex-1 py-3 rounded-full text-sm font-semibold
                                    bg-gradient-to-r from-orange-700 to-orange-500 text-white
                                    hover:opacity-88 transition-opacity duration-150
                                    active:scale-95
                                "
                            >
                                Yes, discard
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Keyframe Styles ── */}
            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(.93); }
                    to   { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default EditProfile;
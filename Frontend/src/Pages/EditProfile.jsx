import React, { useState, useEffect } from "react";
import Navbar2 from "../Components/Navbar2";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";

const resolveImage = (path) => {
    if (!path) {
        return "https://i.pinimg.com/474x/3d/8d/b1/3d8db18cc50c15523a13908a593a480c.jpg";
    }

    if (path.startsWith("http")) return path;

    if (path.startsWith("/uploads")) return `${API_URL}${path}`;

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

    const [form, editForm] = useState({
        profilePhoto: null,
        FName: "",
        LName: "",
        email: "",
        bio: "",
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
        fetch(`${API_URL}/api/getUserData`, {
            credentials: "include",
        })
            .then((res) => {
                if (!res.ok) throw new Error("Unauthorized");
                return res.json();
            })
            .then((data) => {
                setBackendData(data);

                editForm({
                    profilePhoto: null,
                    FName: data.FName || "",
                    LName: data.LName || "",
                    email: data.email || "",
                    bio: data.bio || "",
                    skills: normalizeSkills(data.skills),
                });
            })
            .catch(() => {
                navigate("/");
            });
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
            form.skills.forEach((s) => formData.append("skills", s));
            formData.append("email", form.email);

            if (form.profilePhoto)
                formData.append("profilePhoto", form.profilePhoto);

            const res = await fetch(`${API_URL}/api/editProfile`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            const result = await res.json();

            if (!res.ok) {
                setError(result.message || "Failed to update profile");
            } else {
                setSuccessMsg("Profile updated successfully!");
                setBackendData(result);
                setPreview(null);
            }
        } catch {
            setError("Something went wrong while saving");
        } finally {
            setDisable(false);
        }
    }

    /* ===== File Preview ===== */
    const handleFileChange = (e) => {
        const file = e.target.files?.[0] || null;
        editForm((prev) => ({ ...prev, profilePhoto: file }));
        setPreview(file ? URL.createObjectURL(file) : null);
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
        setError("");
        setSuccessMsg("");
    };

    if (!backendData) {
        return (
            <div className="flex justify-center items-center h-screen text-white">
                <h1>Loading...</h1>
            </div>
        );
    }

    return (
        <div className="bg-black text-white">
            <header className="flex justify-center">
                <Navbar2 />
            </header>

            <main className="flex justify-center pt-5">
                <div>
                    {/* Profile Header */}
                    <div className="flex justify-center">
                        <div className="border-2 rounded-[10px] w-full sm:w-150 border-white/10 bg-white/5 backdrop-blur-md shadow-lg p-3">
                            <div className="flex justify-center ml-5 mr-5">
                                <img
                                    src={preview || resolveImage(backendData.profilePhoto)}

                                    alt="Profile"
                                    className="max-h-60 sm:max-h-80 min-h-60 sm:min-h-80 rounded-[10px] object-cover"
                                />
                            </div>

                            <p className="font-extrabold sm:text-2xl ml-5 mt-2">
                                {backendData.FName}
                            </p>

                            <div className="flex gap-x-3 mt-1 text-gray-400 ml-5">
                                <p className="flex items-center gap-x-1">
                                    <span className="material-symbols-outlined">mail</span>
                                    {form.email}
                                </p>
                                <p className="flex items-center gap-x-1">
                                    <span className="material-symbols-outlined">
                                        location_on
                                    </span>
                                    {backendData.country || "India"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="mt-5 border-2 rounded-[10px] w-full sm:w-150 border-white/10 bg-white/5 backdrop-blur-md shadow-lg p-3 mb-10">
                        <form onSubmit={submit}>
                            {/* Profile Photo */}
                            <div className="flex justify-between items-center mt-5 px-3">
                                <p className="font-bold">Profile Photo</p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="border-2 border-white/5 p-2 rounded-[10px] w-50 sm:w-100"
                                />
                            </div>

                            {/* First Name */}
                            <div className="flex justify-between items-center mt-5 px-3">
                                <p className="font-bold">First Name</p>
                                <input
                                    type="text"
                                    name="FName"
                                    value={form.FName}
                                    onChange={onChange}
                                    className="border-2 border-white/5 p-2 rounded-[10px] w-50 sm:w-100"
                                />
                            </div>

                            {/* Last Name */}
                            <div className="flex justify-between items-center mt-5 px-3">
                                <p className="font-bold">Last Name</p>
                                <input
                                    type="text"
                                    name="LName"
                                    value={form.LName}
                                    onChange={onChange}
                                    className="border-2 border-white/5 p-2 rounded-[10px] w-50 sm:w-100"
                                />
                            </div>

                            {/* Bio */}
                            <div className="flex justify-between items-center mt-5 px-3">
                                <p className="font-bold">Bio</p>
                                <input
                                    type="text"
                                    name="bio"
                                    value={form.bio}
                                    onChange={onChange}
                                    className="border-2 border-white/5 p-2 rounded-[10px] w-50 sm:w-100"
                                />
                            </div>

                            {/* Skills */}
                            <div className="flex justify-between items-center mt-5 px-3">
                                <p className="font-bold">Skills</p>
                                <div className="flex items-center gap-x-1">
                                    <input
                                        type="text"
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        className="border-2 border-white/5 p-2 rounded-[10px] w-40 sm:w-80"
                                    />
                                    <button
                                        type="button"
                                        onClick={addNewSkill}
                                        className="border-2 border-white/5 p-2 rounded-[10px] w-10 sm:w-19 font-mono"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-x-3 mt-4 px-3">
                                {form.skills.map((skill, i) => (
                                    <span
                                        key={i}
                                        className="flex items-center gap-x-2 border-2 border-white/20 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent"
                                    >
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(skill)}
                                            className="text-red-900 font-bold"
                                        >
                                            X
                                        </button>
                                    </span>
                                ))}
                            </div>

                            {/* Email */}
                            <div className="flex justify-between items-center mt-5 px-3">
                                <p className="font-bold">Email</p>
                                <input
                                    type="email"
                                    value={form.email}
                                    readOnly
                                    className="border-2 border-white/5 p-2 rounded-[10px] w-50 sm:w-100"
                                />
                            </div>

                            {/* Messages */}
                            <div className="flex justify-center mt-3 font-bold">
                                <p className="text-red-700">{error}</p>
                                <p className="text-green-700">{successMsg}</p>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-x-5 justify-center mt-5">
                                <button
                                    type="button"
                                    className="h-10 text-sm rounded-[20px] w-30 font-bold bg-red-600 cursor-pointer"
                                    onClick={() => setShowConfirm(true)}
                                >
                                    Discard
                                </button>

                                <button
                                    type="submit"
                                    disabled={disable}
                                    className={`h-10 text-sm rounded-[20px] w-30 font-bold cursor-pointer ${disable
                                        ? "bg-gray-500 cursor-not-allowed"
                                        : "bg-gradient-to-r from-orange-500 to-orange-700"
                                        }`}
                                >
                                    Save Changes
                                </button>
                            </div>

                            {/* Discard Confirm */}
                            {showConfirm && (
                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                                    <div className="bg-black/70 p-5 rounded-md shadow-lg text-center w-[300px] text-white">
                                        <p className="font-semibold mb-4">
                                            Discard changes?
                                        </p>
                                        <div className="flex justify-center gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirm(false)}
                                                className="h-10 text-sm rounded-[20px] w-20 font-bold bg-red-700"
                                            >
                                                No
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleDiscard}
                                                className="h-10 text-sm rounded-[20px] w-20 font-bold bg-gradient-to-r from-orange-500 to-orange-700"
                                            >
                                                Yes
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EditProfile;

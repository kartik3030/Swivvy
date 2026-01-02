import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import API_URL from "../api";

const Signup = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        FName: "",
        LName: "",
        email: "",
        date: "",
        country: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isDisable, setDisable] = useState(false);

    const submitLock = useRef(false);
    const abortRef = useRef(null);

    const onchange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const validateForm = () => {
        const FName = form.FName.trim();
        const LName = form.LName.trim();
        const email = form.email.trim().toLowerCase();
        const password = form.password;

        if (FName.length < 2) return "First name is too short";
        if (!LName) return "Last name is required";
        if (!email) return "Email is required";
        if (!/^\S+@\S+\.\S+$/.test(email)) return "Invalid email address";
        if (!form.country) return "Country is required";
        if (!form.date) return "Date of birth is required";

        if (
            password.length < 10 ||
            !/[A-Z]/.test(password) ||
            !/[a-z]/.test(password) ||
            !/[0-9]/.test(password)
        ) {
            return "Password must be at least 10 chars, include uppercase, lowercase, and a number";
        }

        if (password !== form.confirmPassword) {
            return "Passwords must match";
        }

        return null;
    };

    const submit = async (e) => {
        e.preventDefault();
        if (submitLock.current) return;

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        submitLock.current = true;
        setDisable(true);
        setError("");
        setSuccess("");

        abortRef.current = new AbortController();

        const reqThings = {
            FName: form.FName.trim(),
            LName: form.LName.trim(),
            email: form.email.trim().toLowerCase(),
            country: form.country,
            date: form.date,
            password: form.password,
        };

        try {
            const res = await fetch(`${API_URL}/api/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reqThings),
                signal: abortRef.current.signal,
            });

            let data = {};
            try {
                data = await res.json();
            } catch { }

            if (!res.ok) {
                setError(data.message || "Signup failed. Try again.");
                return;
            }

            setForm({
                FName: "",
                LName: "",
                email: "",
                date: "",
                country: "",
                password: "",
                confirmPassword: "",
            });

            setSuccess("Signup successful! Redirecting to login...");
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            if (err.name !== "AbortError") {
                console.error("Signup error:", err);
                setError("Something went wrong. Please try again.");
            }
        } finally {
            submitLock.current = false;
            setDisable(false);
        }
    };

    return (
        <div className="bg-black text-white min-h-screen">
            <Navbar />

            <div className="p-4 pt-10">
                <h1 className="font-extrabold text-5xl text-center text-red-900">
                    Create your Swivvy Account
                </h1>

                <div className="flex justify-center">
                    <Link to="/login">
                        <span className="text-blue-500 hover:text-blue-700">
                            Already a user?
                        </span>
                    </Link>
                </div>

                <form onSubmit={submit}>
                    <div className="flex gap-x-15 ml-50 mt-10">
                        {/* Personal Details */}
                        <div className="p-5 bg-pink-50/20">
                            <h1 className="text-center font-extrabold">
                                Personal Details
                            </h1>

                            <p className="font-bold text-gray-400">Full Name</p>
                            <div className="flex gap-x-5">
                                <input
                                    type="text"
                                    name="FName"
                                    value={form.FName}
                                    onChange={onchange}
                                    placeholder="First Name"
                                    className="border-2 border-gray-400 p-5 rounded-[10px] w-57"
                                />
                                <input
                                    type="text"
                                    name="LName"
                                    value={form.LName}
                                    onChange={onchange}
                                    placeholder="Last Name"
                                    className="border-2 border-gray-400 p-5 rounded-[10px] w-57"
                                />
                            </div>

                            <div className="mt-3">
                                <p className="font-bold text-gray-400">
                                    Date of birth
                                </p>
                                <input
                                    type="date"
                                    name="date"
                                    value={form.date}
                                    onChange={onchange}
                                    className="border-2 border-gray-400 mt-1 p-5 rounded-[10px] w-120"
                                />
                            </div>

                            <div className="mt-3">
                                <p className="font-bold text-gray-400">
                                    Country / Region
                                </p>
                                <select
                                    name="country"
                                    value={form.country}
                                    onChange={onchange}
                                    className="border-2 border-gray-400 mt-1 p-5 rounded-[10px] w-120"
                                >
                                    <option value="">Select your country</option>
                                    <option value="IN">India</option>
                                    <option value="US">United States</option>
                                    <option value="GB">United Kingdom</option>
                                    <option value="CA">Canada</option>
                                </select>
                            </div>
                        </div>

                        {/* Account Details */}
                        <div className="p-5 bg-pink-50/20">
                            <h1 className="text-center font-extrabold">
                                Account Details
                            </h1>

                            <div className="mt-3">
                                <p className="font-bold text-gray-400">Email</p>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={onchange}
                                    placeholder="Joe@gmail.com"
                                    className="border-2 border-gray-400 p-5 rounded-[10px] w-120"
                                />
                            </div>

                            <div className="mt-3">
                                <p className="font-bold text-gray-400">
                                    Suggestion: Keep your password unique and strong
                                </p>
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={onchange}
                                    placeholder="Password"
                                    className="border-2 border-gray-400 p-5 rounded-[10px] w-120 mt-1"
                                />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={form.confirmPassword}
                                    onChange={onchange}
                                    placeholder="Confirm Password"
                                    className="border-2 border-gray-400 p-5 rounded-[10px] w-120 mt-5"
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-600 text-center mt-3">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p className="text-green-600 text-center mt-3">
                            {success}
                        </p>
                    )}

                    <div className="mt-5 flex justify-center">
                        <button
                            type="submit"
                            disabled={isDisable}
                            className={`w-120 p-3 rounded-[10px] text-white font-bold ${isDisable
                                ? "bg-gray-500"
                                : "bg-blue-700 hover:bg-blue-500"
                                }`}
                        >
                            {isDisable ? "Submitting..." : "Create Account"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;

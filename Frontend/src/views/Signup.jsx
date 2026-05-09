import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import api from "../api";

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
    const [loading, setLoading] = useState(false);

    const submitLock = useRef(false);

    function onchange(e) {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    const validateForm = () => {
        if (form.FName.trim().length < 2) return "First name is too short";
        if (!form.LName.trim()) return "Last name is required";
        if (!form.email.trim()) return "Email is required";
        if (!/^\S+@\S+\.\S+$/.test(form.email))
            return "Invalid email address";
        if (!form.date) return "Date of birth is required";
        if (!form.country) return "Country is required";

        const p = form.password;
        if (
            p.length < 10 ||
            !/[A-Z]/.test(p) ||
            !/[a-z]/.test(p) ||
            !/[0-9]/.test(p)
        ) {
            return "Password must be at least 10 chars, include uppercase, lowercase, and a number";
        }

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
            await api.post("/api/signup", {
                FName: form.FName.trim(),
                LName: form.LName.trim(),
                email: form.email.trim().toLowerCase(),
                date: form.date,
                country: form.country,
                password: form.password,
            });

            setSuccess("Signup successful. Redirecting...");
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                "Signup failed. Try again."
            );
        } finally {
            submitLock.current = false;
            setLoading(false);
        }
    }

    return (
        <div className="bg-black text-white min-h-screen">
            <Navbar />

            <main className="flex justify-center pt-10 sm:pt-20">
                <div className="text-center">
                    <h1 className="font-extrabold text-5xl ml-5 mr-5 text-red-900">
                        Create your Swivvy Account
                    </h1>

                    <p className="mt-2">
                        Already registered?{" "}
                        <Link to="/login">
                            <span className="text-blue-500 hover:text-blue-700">
                                Login
                            </span>
                        </Link>
                    </p>

                    <form onSubmit={submit} className="mt-5">
                        {/* First Name */}
                        <div className="mt-3">
                            <p className="mb-1 text-left sm:ml-30 ml-15 font-semibold">
                                First Name
                            </p>
                            <input
                                type="text"
                                name="FName"
                                value={form.FName}
                                onChange={onchange}
                                placeholder="First Name"
                                className="border-2 text-black bg-white border-white/90 hover:border-[#D8BC9B] p-4 sm:p-5 rounded-[10px] w-[70vw] sm:w-120"
                            />
                        </div>

                        {/* Last Name */}
                        <div className="mt-3">
                            <p className="mb-1 text-left sm:ml-30 ml-15 font-semibold">
                                Last Name
                            </p>
                            <input
                                type="text"
                                name="LName"
                                value={form.LName}
                                onChange={onchange}
                                placeholder="Last Name"
                                className="border-2 text-black bg-white border-white/90 hover:border-[#D8BC9B] p-4 sm:p-5 rounded-[10px] w-[70vw] sm:w-120"
                            />
                        </div>

                        {/* Email */}
                        <div className="mt-3">
                            <p className="mb-1 text-left sm:ml-30 ml-15 font-semibold">
                                Email
                            </p>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={onchange}
                                placeholder="Email"
                                className="border-2 text-black bg-white border-white/90 hover:border-[#D8BC9B] p-4 sm:p-5 rounded-[10px] w-[70vw] sm:w-120"
                            />
                        </div>

                        {/* DOB */}
                        <div className="mt-3">
                            <p className="mb-1 text-left sm:ml-30 ml-15 font-semibold">
                                Date of Birth
                            </p>
                            <input
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={onchange}
                                className="border-2 text-black bg-white border-white/90 hover:border-[#D8BC9B] p-4 sm:p-5 rounded-[10px] w-[70vw] sm:w-120"
                            />
                        </div>

                        {/* Country */}
                        <div className="mt-3">
                            <p className="mb-1 text-left sm:ml-30 ml-15 font-semibold">
                                Country
                            </p>
                            <select
                                name="country"
                                value={form.country}
                                onChange={onchange}
                                className="border-2 text-black bg-white border-white/90 hover:border-[#D8BC9B] p-4 sm:p-5 rounded-[10px] w-[70vw] sm:w-120"
                            >
                                <option value="">Select country</option>
                                <option value="IN">India</option>
                                <option value="US">United States</option>
                                <option value="GB">United Kingdom</option>
                                <option value="CA">Canada</option>
                            </select>
                        </div>

                        {/* Password */}
                        <div className="mt-3">
                            <p className="mb-1 text-left sm:ml-30 ml-15 font-semibold">
                                Password
                            </p>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={onchange}
                                placeholder="Password"
                                className="border-2 text-black bg-white border-white/90 hover:border-[#D8BC9B] p-4 sm:p-5 rounded-[10px] w-[70vw] sm:w-120"
                            />
                        </div>

                        {/* Confirm Password */}
                        <div className="mt-3">
                            <p className="mb-1 text-left sm:ml-30 ml-15 font-semibold">
                                Confirm Password
                            </p>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={onchange}
                                placeholder="Confirm Password"
                                className="border-2 text-black bg-white border-white/90 hover:border-[#D8BC9B] p-4 sm:p-5 rounded-[10px] w-[70vw] sm:w-120"
                            />
                        </div>

                        {error && (
                            <p className="text-red-500 text-center mt-3">
                                {error}
                            </p>
                        )}

                        {success && (
                            <p className="text-green-500 text-center mt-3">
                                {success}
                            </p>
                        )}

                        <div className="mt-4 flex justify-center">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-80 sm:w-120 p-3 cursor-pointer rounded-[10px] text-white font-bold ${loading
                                    ? "bg-gray-400"
                                    : "bg-blue-700 hover:bg-blue-600"
                                    }`}
                            >
                                {loading
                                    ? "Creating account..."
                                    : "Create Account"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Signup;

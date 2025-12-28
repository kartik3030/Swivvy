import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import API_URL from "../api";

const Login = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    function onchange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    async function submit(e) {
        e.preventDefault();

        if (!form.email) {
            setError("Email is required");
            return;
        }
        if (!form.password) {
            setError("Password is required");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${API_URL}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Login failed. Try again.");
                return;
            }

            // ✅ Cookie is already set by backend
            // ❌ Do NOT store token in localStorage

            setForm({ email: "", password: "" });
            navigate("/explore");
        } catch (err) {
            console.error("Login error:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="bg-black text-white min-h-screen">
                <Navbar />

                <main className="flex justify-center pt-10 sm:pt-20">
                    <div className="text-center">
                        <h1 className="font-extrabold text-5xl ml-5 mr-5 text-red-900">
                            Login to your Swivvy Account
                        </h1>

                        <p className="mt-2">
                            Manage your Swivvy Account.{" "}
                            <Link to="/signup">
                                <span className="text-blue-500 hover:text-blue-700">
                                    Not a user?
                                </span>
                            </Link>
                        </p>

                        <form onSubmit={submit} className="mt-5">
                            {/* Email */}
                            <div className="mt-3">
                                <p className="mb-1 text-left sm:ml-35 ml-10 font-semibold ">
                                    Email
                                </p>
                                <input
                                    type="email"
                                    placeholder="Joe@example.com"
                                    className="border-2 text-black bg-white border-white/90 hover:border-[#D8BC9B] p-4 sm:p-5 rounded-[10px] w-[70vw] sm:w-120"
                                    name="email"
                                    value={form.email}
                                    onChange={onchange}
                                />
                            </div>

                            {/* Password */}
                            <div className="mt-3">
                                <p className="mb-1 text-left sm:ml-35 ml-10 font-semibold ">
                                    Password
                                </p>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="border-2 text-black bg-white border-white/90 hover:border-[#D8BC9B] p-4 sm:p-5 rounded-[10px] w-[70vw] sm:w-120"
                                    name="password"
                                    value={form.password}
                                    onChange={onchange}
                                />
                            </div>

                            {/* Forgot Password */}
                            <div className="flex justify-end mt-1 mr-10 sm:mr-40">
                                <button
                                    type="button"
                                    className="text-blue-400 hover:text-blue-600 text-sm"
                                >
                                    Forgotten your password?
                                </button>
                            </div>

                            {/* Info Text */}
                            <div className="flex justify-center">
                                <p className="sm:mt-10 text-white/90 text-xs ml-5 mr-5 sm:w-120">
                                    Your Swivvy Account information is used to sign you in securely
                                    and give you access to your profile, connections, and activity.
                                    Swivvy may record certain data for security, support, and
                                    reporting purposes.
                                </p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <p className="text-red-500 text-center mt-3">
                                    {error}
                                </p>
                            )}

                            {/* Login Button */}
                            <div className="mt-4 flex justify-center">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-80 sm:w-120 p-3 cursor-pointer rounded-[10px] text-white font-bold ${loading
                                        ? "bg-gray-400"
                                        : "bg-blue-700 hover:bg-blue-600"
                                        }`}
                                >
                                    {loading ? "Logging in..." : "Login"}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </>
    );
};

export default Login;

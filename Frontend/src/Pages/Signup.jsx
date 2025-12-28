import React, { useState } from "react";
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

    const onchange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (form.FName.trim().length < 2) return "First name is too short";
        if (!form.LName.trim()) return "Last name is required";
        if (!form.email.trim()) return "Email is required";
        if (!form.country) return "Country is required";
        if (!form.date) return "Date of birth is required";

        if (
            form.password.length < 10 ||
            !/[A-Z]/.test(form.password) ||
            !/[a-z]/.test(form.password) ||
            !/[0-9]/.test(form.password)
        ) {
            return "Password must be at least 10 chars, include uppercase, lowercase, and a number";
        }

        if (form.password !== form.confirmPassword) {
            return "Passwords must match";
        }

        return null;
    };

    const submit = async (e) => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError("");
        setSuccess("");
        setDisable(true);

        const reqThings = {
            FName: form.FName,
            LName: form.LName,
            email: form.email,
            country: form.country,
            date: form.date,
            password: form.password,
        };

        try {
            const res = await fetch(`${API_URL}/api/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reqThings),
            });

            const data = await res.json().catch(() => ({}));

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
            console.error("Signup error:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setDisable(false);
        }
    };

    return (
        <>
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
                        {/* UI UNCHANGED — SAME AS YOUR CODE */}
                        {/* Personal + Account details stay EXACTLY SAME */}

                        {error && (
                            <p className="text-red-600 text-center mt-3">{error}</p>
                        )}
                        {success && (
                            <p className="text-green-600 text-center mt-3">
                                {success}
                            </p>
                        )}

                        <div className="mt-5 flex justify-center">
                            <button
                                type="submit"
                                className={`w-120 p-3 cursor-pointer rounded-[10px] text-white font-bold ${isDisable
                                    ? "bg-gray-500"
                                    : "bg-blue-700 hover:bg-blue-500"
                                    }`}
                                disabled={isDisable}
                            >
                                {isDisable ? "Submitting..." : "Create Account"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Signup;

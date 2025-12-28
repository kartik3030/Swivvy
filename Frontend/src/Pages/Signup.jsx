import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

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

        if (!form.password || form.password !== form.confirmPassword) {
            return "Passwords must match and cannot be empty";
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
            const res = await fetch("http://localhost:3000/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reqThings),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                setError(data.message || "Signup failed. Try again.");
            } else {
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
            }
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
                <div className=" p-4 pt-10">
                    <h1 className="font-extrabold text-5xl text-center text-red-900">
                        Create your Swivvy Account
                    </h1>

                    <div className="flex justify-center">
                        <Link to="/login">
                            <span className="text-blue-500 hover:text-blue-700">Already a user?</span>
                        </Link>
                    </div>

                    <form onSubmit={submit}>
                        <div className="sm:flex sm:mt-2 flex justify-center items-center">
                            <div>
                                {/* Personal Details */}
                                <div className="">
                                    <h1 className="text-center text-2xl font-extrabold">Personal Details</h1>

                                    <div className="flex justify-start ml-10 sm:ml-5 mt-5">
                                        <p>Full Name</p>
                                    </div>

                                    <div className="sm:flex justify-center gap-x-2">
                                        <div className="flex justify-center">
                                            <input type="text" name="FName" value={form.FName}
                                                onChange={onchange} placeholder="First Name"
                                                className="border-2 bg-white text-black hover:border-[#D8BC9B] p-5 rounded-[10px] w-70 sm:w-58" required />
                                        </div>

                                        <div className="flex justify-center">
                                            <input type="text" name="LName" value={form.LName}
                                                onChange={onchange} placeholder="Last Name"
                                                className="border-2 bg-white text-black  hover:border-[#D8BC9B] p-5 rounded-[10px] w-70 mt-2 sm:mt-0 sm:w-58" required />
                                        </div>
                                    </div>

                                    <div className="mt-3">
                                        <div className="flex justify-start ml-10 sm:ml-5"><p>Date of birth</p></div>
                                        <div className="flex justify-center">
                                            <input type="date" name="date" value={form.date} onChange={onchange}
                                                className="border-2 bg-white text-black  hover:border-[#D8BC9B] mt-1 p-5 rounded-[10px] w-70 sm:w-120" required />
                                        </div>
                                    </div>

                                    <div className="mt-3">
                                        <div className="flex justify-start ml-10 sm:ml-5"><p>Country</p></div>
                                        <div className="flex justify-center">
                                            <select name="country" value={form.country} onChange={onchange} aria-placeholder="Country"
                                                className="border-2 bg-white text-black  hover:border-[#D8BC9B] mt-1 p-5 rounded-[10px] w-70 sm:w-120 border-white " required >
                                                <option className="text-black" value="">Select your country</option>
                                                <option className="text-black" value="IN">India</option>
                                                <option className="text-black" value="US">United States</option>
                                                <option className="text-black" value="GB">United Kingdom</option>
                                                <option className="text-black" value="CA">Canada</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Account Details */}
                                <div className="p-5">
                                    <h1 className="text-center text-2xl font-extrabold">Account Details</h1>

                                    <div className="mt-3">
                                        <div className="flex justify-start ml-5 sm:ml-0"><p>Email</p></div>
                                        <div className="flex justify-center">
                                            <input type="email" name="email" value={form.email}
                                                onChange={onchange} placeholder="Joe@gmail.com"
                                                className="border-2 bg-white text-black  hover:border-[#D8BC9B] p-5 rounded-[10px] w-70 sm:w-120" required />
                                        </div>
                                    </div>

                                    <div className="mt-3">
                                        <div className="flex justify-start ml-5 sm:ml-0">
                                            <p className="text-sm text-gray-200">
                                                Suggestion: Keep your password unique and strong
                                            </p>
                                        </div>

                                        <div className="flex justify-center">
                                            <input type="password" name="password" value={form.password}
                                                onChange={onchange} placeholder="Password"
                                                className="border-2 bg-white text-black  hover:border-[#D8BC9B] p-5 rounded-[10px] w-70 sm:w-120 mt-1" required />
                                        </div>

                                        <div className="flex justify-center">
                                            <input type="password" name="confirmPassword" value={form.confirmPassword}
                                                onChange={onchange} placeholder="Confirm Password"
                                                className="border-2 bg-white text-black  hover:border-[#D8BC9B] p-5 rounded-[10px] w-70 sm:w-120 mt-2" required />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {error && <p className="text-red-600 text-center mt-3">{error}</p>}
                        {success && <p className="text-green-600 text-center mt-3">{success}</p>}

                        <div className="mt-5 flex justify-center">
                            <button
                                type="submit"
                                className={`w-120 p-3 cursor-pointer rounded-[10px] text-white font-bold ${isDisable ? "bg-gray-500" : "bg-blue-700 hover:bg-blue-500"
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

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/reset-password`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        token,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to reset password");
            }

            setMessage("Password reset successful");

            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f4f4f5",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "450px",
                    background: "#fff",
                    padding: "32px",
                    borderRadius: "12px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                }}
            >
                <h1
                    style={{
                        marginBottom: "10px",
                        fontSize: "28px",
                    }}
                >
                    Reset Password
                </h1>

                <p
                    style={{
                        color: "#666",
                        marginBottom: "24px",
                    }}
                >
                    Enter your new password below.
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "16px" }}>
                        <input
                            type="password"
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            required
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "12px",
                            background: "#18181b",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                        }}
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>

                {message && (
                    <p
                        style={{
                            marginTop: "16px",
                            textAlign: "center",
                            color:
                                message === "Password reset successful"
                                    ? "green"
                                    : "red",
                        }}
                    >
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
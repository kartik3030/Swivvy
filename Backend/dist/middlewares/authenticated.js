"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const requireAuth = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        res.status(401).json({
            error: "Unauthorized",
        });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const now = Math.floor(Date.now() / 1000);
        const remainingSeconds = decoded.exp - now;
        // Refresh if less than 12 hours remain
        if (remainingSeconds < 12 * 60 * 60) {
            const newToken = jsonwebtoken_1.default.sign({
                id: decoded.id,
                email: decoded.email,
            }, process.env.JWT_SECRET, {
                expiresIn: "1d",
            });
            res.cookie("token", newToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });
        }
        req.user = decoded;
        next();
    }
    catch {
        res.status(401).json({
            error: "Invalid token",
        });
    }
};
exports.default = requireAuth;
//# sourceMappingURL=authenticated.js.map
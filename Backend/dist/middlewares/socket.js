"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_1 = __importDefault(require("cookie"));
const socketAuth = (socket, next) => {
    try {
        const rawCookies = socket.request.headers.cookie;
        if (!rawCookies) {
            next(new Error("Authentication failed"));
            return;
        }
        const parsedCookies = cookie_1.default.parse(rawCookies);
        const token = parsedCookies.token;
        if (!token) {
            next(new Error("Authentication failed"));
            return;
        }
        if (!process.env.JWT_SECRET) {
            next(new Error("JWT_SECRET missing"));
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        socket.user = decoded;
        next();
    }
    catch (err) {
        next(new Error("Invalid token"));
    }
};
exports.default = socketAuth;
//# sourceMappingURL=socket.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dns_1 = __importDefault(require("dns"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const connection_1 = __importDefault(require("./config/connection"));
const socket_1 = __importDefault(require("./config/socket"));
const user_1 = __importDefault(require("./routes/user"));
const swipe_1 = __importDefault(require("./routes/swipe"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
dns_1.default.setServers(["8.8.8.8", "1.1.1.1"]);
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const uploadsDir = path_1.default.join(__dirname, "uploads");
app.use("/uploads", express_1.default.static(uploadsDir));
app.use("/api", user_1.default);
app.use("/api/swipe", swipe_1.default);
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        error: "Internal server error"
    });
});
const server = http_1.default.createServer(app);
(0, socket_1.default)(server);
async function startServer() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI missing");
        }
        await (0, connection_1.default)(process.env.MONGO_URI);
        console.log("MongoDB connected");
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (err) {
        console.error("Database connection failed:", err);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=Server.js.map
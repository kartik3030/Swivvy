const dns = require("dns");
// Use public DNS resolvers to avoid local DNS issues
dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const http = require("http");
const { Server } = require("socket.io");
const cookie = require("cookie");

// Map to track online users (userId -> socketId)
const onlineUsers = new Map();

// Validate required environment variables
if (!process.env.MONGO_URI) throw new Error("MONGO_URI missing");
if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET missing");
if (!process.env.CLIENT_URL) throw new Error("CLIENT_URL missing");

// Database models
const User = require("./Models/User");
const Message = require("./Models/Message");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL;

// Required when running behind a proxy (Render/Nginx)
app.set("trust proxy", 1);

// Parse cookies
app.use(cookieParser());

// Parse request bodies
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Configure CORS for frontend
app.use(
    cors({
        origin: CLIENT_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Handle preflight requests
app.options(
    /.*/,
    cors({
        origin: CLIENT_URL,
        credentials: true,
    })
);

// Cookie configuration for JWT
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // false in development
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

// Middleware to verify JWT from cookies
const requireAuth = (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ error: "Invalid token" });
    }
};

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

// Multer storage configuration
const storage = multer.diskStorage({
    destination: uploadsDir,
    filename: (_, file, cb) =>
        cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

// Allow only image uploads (max 5MB)
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only images allowed"));
        }
        cb(null, true);
    },
});

// Serve uploaded files
app.use("/uploads", express.static(uploadsDir));

// Register new user
app.post("/api/signup", async (req, res) => {
    const { email, password, FName, LName } = req.body;

    if (!email || !password || password.length < 6) {
        return res.status(400).json({ message: "Invalid input" });
    }

    if (await User.findOne({ email })) {
        return res.status(400).json({ message: "User exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashed, FName, LName });

    res.status(201).json({ success: true });
});

// Login user and set JWT cookie
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.cookie("token", token, cookieOptions);
    res.json({ success: true });
});

// Logout user by clearing cookie
app.post("/api/logout", (req, res) => {
    res.clearCookie("token", cookieOptions);
    res.json({ success: true });
});

// Delete account
app.delete("/api/deleteAccount", requireAuth, async (req, res) => {
    await User.findByIdAndDelete(req.user.id);
    res.clearCookie("token", cookieOptions);
    res.json({ success: true });
});

// Handle right swipe (like)
app.post("/api/rightSwipe", requireAuth, async (req, res) => {
    const { userOnFeed } = req.body;

    if (!userOnFeed) {
        return res.status(400).json({ error: "userOnFeed required" });
    }

    const myId = req.user.id;

    const me = await User.findById(myId);
    const other = await User.findById(userOnFeed);

    if (!me || !other) {
        return res.status(404).json({ error: "User not found" });
    }

    // Prevent duplicate swipe
    if (me.swipedUsers.includes(userOnFeed)) {
        return res.json({ match: false });
    }

    me.swipedUsers.push(userOnFeed);
    me.likes.push(userOnFeed);

    let match = false;

    // Check mutual like
    if (other.likes.includes(myId)) {
        match = true;
        me.matches.push(userOnFeed);
        other.matches.push(myId);
        await other.save();
    }

    await me.save();

    res.json({ match });
});

// Handle left swipe (skip)
app.post("/api/leftSwipe", requireAuth, async (req, res) => {
    const me = await User.findById(req.user.id);

    if (!me.swipedUsers.includes(req.body.userOnFeed)) {
        me.swipedUsers.push(req.body.userOnFeed);
        await me.save();
    }

    res.json({ success: true });
});

// Get current user data
app.get("/api/getUserData", requireAuth, async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
});

// Update profile with optional image
app.post(
    "/api/editProfile",
    requireAuth,
    upload.single("profilePhoto"),
    async (req, res) => {
        const photo = req.file ? `/uploads/${req.file.filename}` : undefined;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { ...req.body, ...(photo && { profilePhoto: photo }) },
            { new: true }
        ).select("-password");

        res.json(user);
    }
);

// Get feed (exclude self and swiped users)
app.get("/api/getDatabaseData", requireAuth, async (req, res) => {
    const me = await User.findById(req.user.id);

    const users = await User.find({
        _id: { $nin: [req.user.id, ...me.swipedUsers] },
    }).select("-password");

    res.json(users);
});

// Get matches
app.post("/api/getUserMatches", requireAuth, async (req, res) => {
    const user = await User.findById(req.user.id).populate(
        "matches",
        "FName LName profilePhoto"
    );

    res.json(user.matches);
});

// Fetch messages for a room
app.post("/api/getMessages", requireAuth, async (req, res) => {
    if (!req.body.roomId) {
        return res.status(400).json({ error: "roomId required" });
    }

    const messages = await Message.find({
        roomId: req.body.roomId,
    }).sort({ createdAt: 1 });

    res.json(messages);
});

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: CLIENT_URL,
        credentials: true,
    },
    transports: ["websocket"],
});

// Configure heartbeat
io.engine.pingTimeout = 60000;
io.engine.pingInterval = 25000;

// Authenticate socket using JWT from cookies
io.use((socket, next) => {
    const raw = socket.request.headers.cookie;

    if (!raw) return next(new Error("No cookie"));

    const parsed = cookie.parse(raw);
    const token = parsed.token;

    if (!token) return next(new Error("No token"));

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(new Error("Invalid token"));
        socket.user = user;
        next();
    });
});

// Socket connection handlers
io.on("connection", (socket) => {
    const userId = String(socket.user.id);
    onlineUsers.set(userId, socket.id);

    // Leave all joined rooms
    socket.on("leave_all", () => {
        for (const room of socket.rooms) {
            if (room !== socket.id) socket.leave(room);
        }
    });

    // Join room
    socket.on("join_room", (roomId) => {
        if (roomId) socket.join(roomId);
    });

    // Send message
    socket.on("send_message", async (msg) => {
        const saved = await Message.create({
            roomId: msg.roomId,
            senderId: socket.user.id,
            receiverId: msg.receiverId,
            text: msg.text,
        });

        io.to(msg.roomId).emit("receive_message", saved);
    });

    // Remove user on disconnect
    socket.on("disconnect", () => {
        onlineUsers.delete(userId);
    });
});

// Serve frontend build
const distPath = path.join(__dirname, "../../Frontend/dist");

if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));

    // Fallback to index.html for SPA routing
    app.get(/.*/, (req, res) => {
        if (req.originalUrl.startsWith("/api")) {
            return res.status(404).json({ error: "API route not found" });
        }

        res.sendFile(path.join(distPath, "index.html"));
    });
}

// Start server after DB connection
(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");

        server.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("Startup failed:", err);
    }
})();
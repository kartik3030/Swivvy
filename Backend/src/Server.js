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
require("dotenv").config();

/* ====================== APP ====================== */

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL;
const isProd = process.env.NODE_ENV === "production";

/* ====================== MIDDLEWARE ====================== */

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: CLIENT_URL,
        credentials: true,
    })
);

/* ====================== DATABASE ====================== */

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

/* ====================== MODELS ====================== */

const User = mongoose.model(
    "User",
    new mongoose.Schema(
        {
            email: { type: String, unique: true },
            password: String,
            FName: String,
            LName: String,
            bio: String,
            skills: [String],
            profilePhoto: String,
            likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
            matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
            swipedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        },
        { timestamps: true }
    )
);

const Message = mongoose.model(
    "Message",
    new mongoose.Schema(
        {
            roomId: String,
            senderId: mongoose.Schema.Types.ObjectId,
            text: String,
        },
        { timestamps: true }
    )
);

/* ====================== COOKIE CONFIG ====================== */

const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

/* ====================== AUTH MIDDLEWARE ====================== */

const requireAuth = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        return res.status(401).json({ error: "Invalid token" });
    }
};

/* ====================== FILE UPLOAD ====================== */

const uploadsDir = path.join(__dirname, "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
    destination: uploadsDir,
    filename: (_, file, cb) =>
        cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

const upload = multer({ storage });

app.use("/uploads", express.static(uploadsDir));

/* ====================== AUTH ROUTES ====================== */

app.post("/api/signup", async (req, res) => {
    const { email, password, FName, LName } = req.body;

    if (await User.findOne({ email }))
        return res.status(400).json({ message: "User exists" });

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashed, FName, LName });

    res.status(201).json({ success: true });
});

app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
        return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.cookie("token", token, cookieOptions);
    res.json({ success: true });
});

app.post("/api/logout", (req, res) => {
    res.clearCookie("token", cookieOptions);
    res.json({ success: true });
});

/* ====================== USER ====================== */

app.get("/api/getUserData", requireAuth, async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
});

app.post(
    "/api/editProfile",
    requireAuth,
    upload.single("profilePhoto"),
    async (req, res) => {
        const { FName, LName, bio, skills } = req.body;

        const photo = req.file
            ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
            : undefined;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                FName,
                LName,
                bio,
                skills: Array.isArray(skills) ? skills : [skills],
                ...(photo && { profilePhoto: photo }),
            },
            { new: true }
        ).select("-password");

        res.json(user);
    }
);

/* ====================== FEED / MATCH ====================== */

app.get("/api/getDatabaseData", requireAuth, async (req, res) => {
    const me = await User.findById(req.user.id);

    const users = await User.find({
        _id: { $nin: [req.user.id, ...me.swipedUsers] },
    }).select("-password");

    res.json(users);
});

app.post("/api/getUserMatches", requireAuth, async (req, res) => {
    const user = await User.findById(req.user.id).populate(
        "matches",
        "FName LName profilePhoto"
    );

    res.json(user.matches);
});

/* ====================== MESSAGES ====================== */

app.post("/api/getMessages", requireAuth, async (req, res) => {
    const messages = await Message.find({ roomId: req.body.roomId })
        .sort({ createdAt: 1 });

    res.json(messages);
});

/* ====================== Logout ====================== */
app.post("/api/logout", (req, res) => {
    res.clearCookie("token", cookieOptions);
    res.json({ success: true });
});

/* ====================== Delete account ====================== */
app.delete("/api/deleteAccount", requireAuth, async (req, res) => {
    try {
        const userId = req.user.id;

        // Delete user
        await User.findByIdAndDelete(userId);

        // Delete related messages
        await Message.deleteMany({
            $or: [
                { senderId: userId },
                { receiverId: userId },
            ],
        });

        // Clear auth cookie
        res.clearCookie("token", cookieOptions);

        res.json({ success: true });
    } catch (err) {
        console.error("Delete account error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

/* ====================== SOCKET.IO ====================== */

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: CLIENT_URL,
        credentials: true,
    },
});

io.use((socket, next) => {
    const cookie = socket.handshake.headers.cookie;
    if (!cookie) return next(new Error("Unauthorized"));

    const token = cookie
        .split("; ")
        .find(c => c.startsWith("token="))
        ?.split("=")[1];

    if (!token) return next(new Error("Unauthorized"));

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        next(new Error("Unauthorized"));
    }
});

io.on("connection", socket => {
    socket.on("join_room", room => socket.join(room));
    socket.on("send_message", async data => {
        const msg = await Message.create(data);
        socket.to(data.roomId).emit("receive_message", msg);
    });
});

/* ====================== START ====================== */

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (${process.env.NODE_ENV})`);
});

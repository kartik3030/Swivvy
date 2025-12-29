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

const User = require("./models/User");
const Message = require("./models/Message");

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const isProd = process.env.NODE_ENV === "production";

/* ================= BASIC MIDDLEWARE ================= */

app.use(express.json());
app.use(cookieParser());

// CORS only needed in DEV (separate origins)
if (!isProd) {
    app.use(
        cors({
            origin: CLIENT_URL,
            credentials: true,
        })
    );
}

/* ================= DATABASE ================= */

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => {
        console.error("Mongo error:", err);
        process.exit(1);
    });

/* ================= AUTH ================= */

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS only in prod
    sameSite: "lax", // ALWAYS lax
    maxAge: 7 * 24 * 60 * 60 * 1000,
};


const requireAuth = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ error: "Invalid token" });
    }
};

/* ================= FILE UPLOAD ================= */

const uploadsDir = path.join(__dirname, "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
    destination: uploadsDir,
    filename: (_, file, cb) =>
        cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

const upload = multer({ storage });
app.use("/uploads", express.static(uploadsDir));

/* ================= AUTH ROUTES ================= */

app.post("/api/signup", async (req, res) => {
    const { email, password, FName, LName } = req.body;

    if (!email || !password || password.length < 6)
        return res.status(400).json({ message: "Invalid input" });

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
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });
    res.json({ success: true });
});

/* ================= SWIPE ================= */

app.post("/api/rightSwipe", requireAuth, async (req, res) => {
    try {
        const { userOnFeed } = req.body;
        const myId = req.user.id;

        if (!userOnFeed) {
            return res.status(400).json({ error: "userOnFeed missing" });
        }

        const me = await User.findById(myId);
        const other = await User.findById(userOnFeed);

        if (!me || !other) {
            return res.status(404).json({ error: "User not found" });
        }

        // Prevent duplicate swipes
        if (me.swipedUsers.includes(userOnFeed)) {
            return res.json({ match: false });
        }

        me.swipedUsers.push(userOnFeed);
        me.likes.push(userOnFeed);

        let match = false;

        if (other.likes.includes(myId)) {
            match = true;
            me.matches.push(userOnFeed);
            other.matches.push(myId);
            await other.save();
        }

        await me.save();

        res.json({ match });
    } catch (err) {
        console.error("Right swipe error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/api/leftSwipe", requireAuth, async (req, res) => {
    try {
        const { userOnFeed } = req.body;
        const myId = req.user.id;

        if (!userOnFeed) {
            return res.status(400).json({ error: "userOnFeed missing" });
        }

        const me = await User.findById(myId);

        if (!me.swipedUsers.includes(userOnFeed)) {
            me.swipedUsers.push(userOnFeed);
            await me.save();
        }

        res.json({ success: true });
    } catch (err) {
        console.error("Left swipe error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

/* ================= USER ================= */

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

/* ================= FEED ================= */

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

/* ================= MESSAGES ================= */

app.post("/api/getMessages", requireAuth, async (req, res) => {
    const messages = await Message.find({ roomId: req.body.roomId }).sort({
        createdAt: 1,
    });
    res.json(messages);
});

/* ================= DELETE ACCOUNT ================= */

app.delete("/api/deleteAccount", requireAuth, async (req, res) => {
    const userId = req.user.id;

    await User.findByIdAndDelete(userId);
    await Message.deleteMany({
        $or: [{ senderId: userId }, { receiverId: userId }],
    });

    res.clearCookie("token", cookieOptions);
    res.json({ success: true });
});

/* ================= FRONTEND ================= */

const distPath = path.resolve(__dirname, "../../frontend/dist");

if (fs.existsSync(distPath)) {
    console.log("Serving frontend from:", distPath);

    app.use(express.static(distPath));

    // React Router fallback
    app.get(/^\/(?!api).*/, (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
    });
} else {
    console.log("Frontend dist not found. Running API-only mode.");
}


/* ================= SOCKET ================= */

const server = http.createServer(app);

const io = new Server(server, {
    cors: isProd
        ? undefined
        : { origin: CLIENT_URL, credentials: true },
});

io.use((socket, next) => {
    const cookies = Object.fromEntries(
        socket.handshake.headers.cookie
            ?.split("; ")
            .map(c => c.split("=")) || []
    );

    const token = cookies.token;
    if (!token) return next(new Error("Unauthorized"));

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        next(new Error("Unauthorized"));
    }
});

io.on("connection", socket => {
    socket.on("join_room", roomId => {
        if (roomId) socket.join(roomId);
    });

    socket.on("send_message", async data => {
        const msg = await Message.create(data);
        io.to(data.roomId).emit("receive_message", msg);
    });
});

/* ================= START ================= */

server.listen(PORT, () => {
    console.log(
        `Server running on ${PORT} (${isProd ? "PRODUCTION" : "DEVELOPMENT"})`
    );
});

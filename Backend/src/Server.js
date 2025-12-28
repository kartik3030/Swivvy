const express = require("express");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./Database/db.js");
const User = require("./Models/User.js");
const Message = require("./Models/Message.js");
require("dotenv").config();
const fs = require("fs");
const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 3000;
const distPath = path.resolve(__dirname, "../../Frontend/dist");

const app = express();

/* ====================== FILE SYSTEM ====================== */

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

/* ====================== MIDDLEWARE ====================== */

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(uploadsDir));

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

/* ====================== DATABASE ====================== */

connectDB();

/* ====================== AUTH UTILS ====================== */

const getUserFromToken = (req) => {
    const token =
        req.headers.authorization?.split(" ")[1] || req.cookies.token;
    if (!token) return null;
    return jwt.verify(token, process.env.JWT_SECRET);
};

/* ====================== SIGNUP ====================== */

app.post("/api/signup", async (req, res) => {
    try {
        const { FName, LName, date, email, password, country } = req.body;

        if (await User.findOne({ email }))
            return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            FName,
            LName,
            date,
            email,
            password: hashedPassword,
            country,
        });

        res.status(201).json({ message: "User registered" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

/* ====================== LOGIN ====================== */

app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: false,
        });

        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

/* ====================== EDIT PROFILE ====================== */

const storage = multer.diskStorage({
    destination: uploadsDir,
    filename: (_, file, cb) =>
        cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

app.post("/api/editProfile", upload.single("profilePhoto"), async (req, res) => {
    try {
        const { FName, LName, bio, skills, email } = req.body;

        const photo = req.file
            ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
            : undefined;

        const user = await User.findOneAndUpdate(
            { email },
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
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

/* ====================== Get User who is currently on app ====================== */

app.get("/api/getUserData", async (req, res) => {
    try {
        let token = req.headers.authorization?.split(" ")[1];

        if (!token && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (err) {
        console.error("getUserData error:", err);
        res.status(500).json({ error: "Server error" });
    }
});


/* ====================== FEED (NO REPEATS) ====================== */

app.get("/api/getDatabaseData", async (req, res) => {
    try {
        const decoded = getUserFromToken(req);
        if (!decoded) return res.status(401).json({ error: "Unauthorized" });

        const currentUser = await User.findById(decoded.id);

        const users = await User.find({
            _id: {
                $nin: [
                    decoded.id,
                    ...currentUser.swipedUsers
                ]
            }
        }).select("-password");

        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

/* ====================== RIGHT SWIPE ====================== */

app.post("/api/rightSwipe", async (req, res) => {
    try {
        const decoded = getUserFromToken(req);
        if (!decoded) return res.status(401).json({ error: "Unauthorized" });

        const { userOnFeed } = req.body;

        const currentUser = await User.findById(decoded.id);
        const targetUser = await User.findById(userOnFeed);

        if (!targetUser) return res.status(404).json({ error: "User not found" });

        // mark swiped
        if (!currentUser.swipedUsers.includes(userOnFeed)) {
            currentUser.swipedUsers.push(userOnFeed);
        }

        // like
        if (!currentUser.likes.includes(userOnFeed)) {
            currentUser.likes.push(userOnFeed);
        }

        let match = false;

        if (targetUser.likes.includes(decoded.id)) {
            match = true;

            if (!currentUser.matches.includes(userOnFeed)) {
                currentUser.matches.push(userOnFeed);
                targetUser.matches.push(decoded.id);
                await targetUser.save();
            }
        }

        await currentUser.save();

        res.json({ match });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

/* ====================== LEFT SWIPE ====================== */

app.post("/api/leftSwipe", async (req, res) => {
    try {
        const decoded = getUserFromToken(req);
        if (!decoded) return res.status(401).json({ error: "Unauthorized" });

        const { userOnFeed } = req.body;

        await User.findByIdAndUpdate(decoded.id, {
            $addToSet: { swipedUsers: userOnFeed }
        });

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

/* ====================== MATCHES ====================== */

app.post("/api/getUserMatches", async (req, res) => {
    const { userId } = req.body;
    const user = await User.findById(userId).populate(
        "matches",
        "FName LName profilePhoto"
    );
    res.json(user.matches);
});

/* ====================== MESSAGES ====================== */

app.post("/api/getMessages", async (req, res) => {
    const { roomId } = req.body;
    const messages = await Message.find({ roomId }).sort({ createdAt: 1 });
    res.json(messages);
});

/* ====================== FRONTEND ====================== */

app.use(express.static(distPath));
app.get(/^\/(?!api).*/, (_, res) =>
    res.sendFile(path.join(distPath, "index.html"))
);

/* ====================== SOCKET ====================== */

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "http://localhost:5173", credentials: true },
});

io.on("connection", (socket) => {
    socket.on("join_room", (room) => socket.join(room));
    socket.on("send_message", async (data) => {
        const msg = await Message.create(data);
        socket.to(data.roomId).emit("receive_message", msg);
    });
});

/* ====================== START ====================== */

server.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
);

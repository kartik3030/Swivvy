// User CRUD operations

const express = require("express");
const User = require("../models/user")
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const requireAuth = require("../middlewares/authenticated")


const cookieOptions = {
    httpOnly: true,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};


// Create New User
router.post("/api/signup", async (req, res) => {
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

// Login that User
router.post("/api/login", async (req, res) => {
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

// Logout User 
router.post("/api/logout", (req, res) => {
    res.clearCookie("token", cookieOptions);
    res.json({ success: true });
});

// Read the all User (exclude self and swiped users)
router.get("/api/getDatabaseData", requireAuth, async (req, res) => {
    const me = await User.findById(req.user.id);

    const users = await User.find({
        _id: { $nin: [req.user.id, ...me.swipedUsers] },
    }).select("-password");

    res.json(users);
});

// Delete User
router.delete("/api/deleteAccount", requireAuth, async (req, res) => {
    await User.findByIdAndDelete(req.user.id);
    res.clearCookie("token", cookieOptions);
    res.json({ success: true });
});

// Get matches
router.post("/api/getUserMatches", requireAuth, async (req, res) => {
    const user = await User.findById(req.user.id).populate(
        "matches",
        "FName LName profilePhoto"
    );

    res.json(user.matches);
});


module.exports = router;
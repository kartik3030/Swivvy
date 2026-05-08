const User = require("../models/user");
const Message = require("../models/messages");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const cookieOptions = {
    httpOnly: true,
    path: "/",
    maxAge: 24 * 60 * 60 * 1000,
};

// signup controller
const handleSignup = async (req, res, next) => {
    try {
        const { email, password, FName, LName } = req.body;

        if (!email || !password || !FName || !LName) {
            return res.status(400).json({
                error: "All fields are required",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: "Password must be at least 6 characters",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            return res.status(400).json({
                error: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            email: normalizedEmail,
            password: hashedPassword,
            FName: FName.trim(),
            LName: LName.trim(),
        });

        res.status(201).json({
            success: true,
        });

    } catch (err) {
        next(err);
    }
};

// login controller
const handleLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password required",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({
            email: normalizedEmail,
        });

        if (!user) {
            return res.status(401).json({
                error: "Invalid credentials",
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                error: "Invalid credentials",
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        res.cookie("token", token, cookieOptions);

        res.json({
            success: true,
        });

    } catch (err) {
        next(err);
    }
};

// logout controller
const handleLogout = (req, res) => {
    res.clearCookie("token", cookieOptions);

    res.json({
        success: true,
    });
};

// feed controller
const showUsers = async (req, res, next) => {
    try {
        const me = await User.findById(req.user.id);

        if (!me) {
            return res.status(404).json({
                error: "User not found",
            });
        }

        const users = await User.find({
            _id: {
                $nin: [req.user.id, ...me.swipedUsers],
            },
        }).select("-password");

        res.json(users);

    } catch (err) {
        next(err);
    }
};

// edit profile controller
const editProfile = async (req, res, next) => {
    try {
        const allowedFields = [
            "FName",
            "LName",
            "bio",
            "age",
            "gender",
            "interests",
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        if (req.file) {
            updates.profilePhoto = `/uploads/${req.file.filename}`;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            updates,
            {
                new: true,
            }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                error: "User not found",
            });
        }

        res.json(updatedUser);

    } catch (err) {
        next(err);
    }
};

// delete account controller
const deleteAccount = async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.user.id);

        res.clearCookie("token", cookieOptions);

        res.json({
            success: true,
        });

    } catch (err) {
        next(err);
    }
};

// matches controller
const getMatches = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate(
            "matches",
            "FName LName profilePhoto"
        );

        if (!user) {
            return res.status(404).json({
                error: "User not found",
            });
        }

        res.json(user.matches);

    } catch (err) {
        next(err);
    }
};

// current user controller
const getCurrentUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                error: "User not found",
            });
        }

        res.json(user);

    } catch (err) {
        next(err);
    }
};

const handleGetMessage = async (req, res, next) => {
    try {
        const { roomId } = req.body;

        if (!roomId) {
            return res.status(400).json({
                error: "roomId is required",
            });
        }

        const messages = await Message.find({
            roomId,
        }).sort({
            createdAt: 1,
        });

        res.json(messages);

    } catch (err) {
        next(err);
    }
};

module.exports = {
    handleSignup,
    handleLogin,
    handleLogout,
    showUsers,
    editProfile,
    deleteAccount,
    getMatches,
    getCurrentUser,
    handleGetMessage
};
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetMessage = exports.getCurrentUser = exports.getMatches = exports.deleteAccount = exports.editProfile = exports.showUsers = exports.handleLogout = exports.handleLogin = exports.handleSignup = void 0;
const user_1 = __importDefault(require("../models/user"));
const messages_1 = __importDefault(require("../models/messages"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const uploadToCloudinary_1 = require("../utils/uploadToCloudinary");
const cookieOptions = {
    httpOnly: true,
    path: "/",
};
// signup controller
const handleSignup = async (req, res, next) => {
    try {
        const { email, password, FName, LName, country, date } = req.body;
        if (!email || !password || !FName || !LName || !country || !date) {
            res.status(400).json({
                error: "All fields are required",
            });
            return;
        }
        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = await user_1.default.findOne({
            email: normalizedEmail,
        });
        if (existingUser) {
            res.status(400).json({
                error: "User already exists",
            });
            return;
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        await user_1.default.create({
            email: normalizedEmail,
            password: hashedPassword,
            FName: FName.trim(),
            LName: LName.trim(),
            country,
            date,
        });
        res.status(201).json({
            success: true,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.handleSignup = handleSignup;
// login controller
const handleLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                error: "Email and password required",
            });
            return;
        }
        const normalizedEmail = email.toLowerCase().trim();
        const user = await user_1.default.findOne({
            email: normalizedEmail,
        });
        if (!user) {
            res.status(401).json({
                error: "Invalid credentials",
            });
            return;
        }
        const passwordMatch = await bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({
                error: "Invalid credentials",
            });
            return;
        }
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET missing");
        }
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
            email: user.email,
        }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        res.cookie("token", token, cookieOptions);
        res.json({
            success: true,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.handleLogin = handleLogin;
// logout controller
const handleLogout = (req, res) => {
    res.clearCookie("token", cookieOptions);
    res.json({
        success: true,
    });
};
exports.handleLogout = handleLogout;
// feed controller
const showUsers = async (req, res, next) => {
    try {
        const me = await user_1.default.findById(req.user.id);
        if (!me) {
            res.status(404).json({
                error: "User not found",
            });
            return;
        }
        const users = await user_1.default.find({
            _id: {
                $nin: [req.user.id, ...me.swipedUsers],
            },
        }).select("-password");
        res.json(users);
    }
    catch (err) {
        next(err);
    }
};
exports.showUsers = showUsers;
// edit profile controller
const editProfile = async (req, res, next) => {
    try {
        const allowedFields = [
            "FName",
            "LName",
            "bio",
            "age",
            "country",
            "skills",
        ];
        const updates = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }
        const user = await user_1.default.findById(req.user.id);
        if (!user) {
            res.status(404).json({
                error: "User not found",
            });
            return;
        }
        if (req.file) {
            if (user.profilePhotoPublicId) {
                await cloudinary_1.default.uploader.destroy(user.profilePhotoPublicId);
            }
            const result = await (0, uploadToCloudinary_1.uploadToCloudinary)(req.file.buffer);
            updates.profilePhoto = result.secure_url;
            updates.profilePhotoPublicId =
                result.public_id;
        }
        const updatedUser = await user_1.default.findByIdAndUpdate(req.user.id, updates, {
            new: true,
            runValidators: true,
        }).select("-password");
        res.json(updatedUser);
    }
    catch (err) {
        next(err);
    }
};
exports.editProfile = editProfile;
// delete account controller
const deleteAccount = async (req, res, next) => {
    try {
        await user_1.default.findByIdAndDelete(req.user.id);
        res.clearCookie("token", cookieOptions);
        res.json({
            success: true,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteAccount = deleteAccount;
// matches controller
const getMatches = async (req, res, next) => {
    try {
        const user = await user_1.default.findById(req.user.id).populate("matches", "FName LName profilePhoto");
        if (!user) {
            res.status(404).json({
                error: "User not found",
            });
            return;
        }
        res.json(user.matches);
    }
    catch (err) {
        next(err);
    }
};
exports.getMatches = getMatches;
// current user controller
const getCurrentUser = async (req, res, next) => {
    try {
        const user = await user_1.default.findById(req.user.id).select("-password");
        if (!user) {
            res.status(404).json({
                error: "User not found",
            });
            return;
        }
        res.json(user);
    }
    catch (err) {
        next(err);
    }
};
exports.getCurrentUser = getCurrentUser;
// messages controller
const handleGetMessage = async (req, res, next) => {
    try {
        const { roomId } = req.body;
        if (!roomId) {
            res.status(400).json({
                error: "roomId is required",
            });
            return;
        }
        const messages = await messages_1.default.find({
            roomId,
        }).sort({
            createdAt: 1,
        });
        res.json(messages);
    }
    catch (err) {
        next(err);
    }
};
exports.handleGetMessage = handleGetMessage;
//# sourceMappingURL=user.js.map
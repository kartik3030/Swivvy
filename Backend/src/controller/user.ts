import User from "../models/user";
import Message from "../models/messages";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const nodemailer = require("nodemailer");
import cloudinary from "../config/cloudinary";

import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import { resetPasswordTemplate } from "../utils/reset-password";
import { Request, Response, NextFunction } from "express";
import transporter from "../config/Email-services";


const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none" as const,
    path: "/",
};

interface SignupBody {
    email: string;
    password: string;
    FName: string;
    LName: string;
    country: string;
    date: string;
}

interface LoginBody {
    email: string;
    password: string;
}

interface MessageBody {
    roomId: string;
}

interface AuthRequest extends Request {
    user: {
        id: string;
    };
    file?: Express.Multer.File;
}

interface ProfileUpdates {
    FName?: string;
    LName?: string;
    bio?: string;
    age?: number;
    country?: string;
    skills?: string[];
    profilePhoto?: string;
    profilePhotoPublicId?: string;
}

// signup controller
const handleSignup = async (
    req: Request<{}, {}, SignupBody>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email, password, FName, LName, country, date } = req.body;

        if (!email || !password || !FName || !LName || !country || !date) {
            res.status(400).json({
                error: "All fields are required",
            });
            return;
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            res.status(400).json({
                error: "User already exists",
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
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

    } catch (err) {
        next(err);
    }
};

// login controller
const handleLogin = async (
    req: Request<{}, {}, LoginBody>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                error: "Email and password required",
            });
            return;
        }

        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({
            email: normalizedEmail,
        });

        if (!user) {
            res.status(401).json({
                error: "Invalid credentials",
            });
            return;
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            res.status(401).json({
                error: "Invalid credentials",
            });
            return;
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET missing");
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
const handleLogout = (req: Request, res: Response): void => {
    res.clearCookie("token", cookieOptions);

    res.json({
        success: true,
    });
};

// feed controller
const showUsers = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const me = await User.findById(req.user.id);

        if (!me) {
            res.status(404).json({
                error: "User not found",
            });
            return;
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
const editProfile = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const allowedFields = [
            "FName",
            "LName",
            "bio",
            "age",
            "country",
            "skills",
        ];

        const updates: ProfileUpdates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                (updates as any)[field] = req.body[field];
            }
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            res.status(404).json({
                error: "User not found",
            });
            return;
        }

        if (req.file) {
            if (user.profilePhotoPublicId) {
                await cloudinary.uploader.destroy(
                    user.profilePhotoPublicId
                );
            }

            const result = await uploadToCloudinary(
                req.file.buffer
            );

            updates.profilePhoto = result.secure_url;

            (updates as any).profilePhotoPublicId =
                result.public_id;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            updates,
            {
                new: true,
                runValidators: true,
            }
        ).select("-password");

        res.json(updatedUser);

    } catch (err) {
        next(err);
    }
};

// delete account controller
const deleteAccount = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
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
const getMatches = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const user = await User.findById(req.user.id).populate(
            "matches",
            "FName LName profilePhoto"
        );

        if (!user) {
            res.status(404).json({
                error: "User not found",
            });
            return;
        }

        res.json(user.matches);

    } catch (err) {
        next(err);
    }
};

// current user controller
const getCurrentUser = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            res.status(404).json({
                error: "User not found",
            });
            return;
        }

        res.json(user);

    } catch (err) {
        next(err);
    }
};

// messages controller
const handleGetMessage = async (
    req: Request<{}, {}, MessageBody>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { roomId } = req.body;

        if (!roomId) {
            res.status(400).json({
                error: "roomId is required",
            });
            return;
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

const handleForgotPassword = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("No user found");
    }

    //sending this token to authenticate the actual user
    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Reset Your Password",
            text: `You requested a password reset. If you didn't request this, you can safely ignore this email.`,
            html: resetPasswordTemplate(email, resetUrl),
        });

        res.json("Email Sent");
    } catch (err) {
        console.error("Error while sending mail:", err);
        res.status(500).json("Failed to send email");
    }
};


const handleResetPassword = async (
    req: Request,
    res: Response
) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({
                message: "Token and password are required",
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as {
            userId: string;
        };

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;

        await user.save();

        return res.status(200).json({
            message: "Password reset successful",
        });

    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                message: "Reset link has expired",
            });
        }

        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                message: "Invalid reset token",
            });
        }

        console.error(error);

        return res.status(500).json({
            message: "Something went wrong",
        });
    }
};

export {
    handleSignup,
    handleLogin,
    handleLogout,
    showUsers,
    editProfile,
    deleteAccount,
    getMatches,
    getCurrentUser,
    handleGetMessage,
    handleForgotPassword,
    handleResetPassword,
};

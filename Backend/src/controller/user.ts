import User from "../models/user";
import Message from "../models/messages";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const cookieOptions = {
    httpOnly: true,
    path: "/",
    maxAge: 24 * 60 * 60 * 1000,
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

        if (req.file) {
            updates.profilePhoto = `/uploads/${req.file.filename}`;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            updates,
            {
                new: true,
                runValidators: true,
            }
        ).select("-password");

        if (!updatedUser) {
            res.status(404).json({
                error: "User not found",
            });
            return;
        }

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
};
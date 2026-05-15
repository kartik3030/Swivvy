import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/user";

interface AuthRequest extends Request {
    user: {
        id: string;
    };
}

interface SwipeBody {
    userOnFeed: string;
}

const handleRightSwipe = async (
    req: AuthRequest & Request<{}, {}, SwipeBody>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { userOnFeed } = req.body;
        const myId = req.user.id;

        if (!userOnFeed) {
            res.status(400).json({
                error: "userOnFeed required",
            });
            return;
        }

        if (userOnFeed === myId) {
            res.status(400).json({
                error: "Cannot swipe yourself",
            });
            return;
        }

        const me = await User.findById(myId);
        const other = await User.findById(userOnFeed);

        if (!me || !other) {
            res.status(404).json({
                error: "User not found",
            });
            return;
        }

        if (me.swipedUsers.some((id) => id.toString() === userOnFeed)) {
            res.json({
                match: false,
                message: "Already swiped",
            });
            return;
        }

        me.swipedUsers.push(new mongoose.Types.ObjectId(userOnFeed));
        me.likes.push(new mongoose.Types.ObjectId(userOnFeed));

        let match = false;

        if (other.likes.some((id) => id.toString() === myId)) {
            match = true;

            if (!me.matches.some((id) => id.toString() === userOnFeed)) {
                me.matches.push(new mongoose.Types.ObjectId(userOnFeed));
            }

            if (!other.matches.some((id) => id.toString() === myId)) {
                other.matches.push(new mongoose.Types.ObjectId(myId));
            }

            await other.save();
        }

        await me.save();

        res.json({
            match,
        });

    } catch (err) {
        next(err);
    }
};

const handleLeftSwipe = async (
    req: AuthRequest & Request<{}, {}, SwipeBody>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { userOnFeed } = req.body;
        const myId = req.user.id;

        if (!userOnFeed) {
            res.status(400).json({
                error: "userOnFeed required",
            });
            return;
        }

        if (userOnFeed === myId) {
            res.status(400).json({
                error: "Cannot swipe yourself",
            });
            return;
        }

        const me = await User.findById(myId);

        if (!me) {
            res.status(404).json({
                error: "User not found",
            });
            return;
        }

        if (!me.swipedUsers.some((id) => id.toString() === userOnFeed)) {
            me.swipedUsers.push(new mongoose.Types.ObjectId(userOnFeed));
            await me.save();
        }

        res.json({
            success: true,
        });

    } catch (err) {
        next(err);
    }
};

export {
    handleRightSwipe,
    handleLeftSwipe,
};
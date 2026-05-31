"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLeftSwipe = exports.handleRightSwipe = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("../models/user"));
const handleRightSwipe = async (req, res, next) => {
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
        const me = await user_1.default.findById(myId);
        const other = await user_1.default.findById(userOnFeed);
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
        me.swipedUsers.push(new mongoose_1.default.Types.ObjectId(userOnFeed));
        me.likes.push(new mongoose_1.default.Types.ObjectId(userOnFeed));
        let match = false;
        if (other.likes.some((id) => id.toString() === myId)) {
            match = true;
            if (!me.matches.some((id) => id.toString() === userOnFeed)) {
                me.matches.push(new mongoose_1.default.Types.ObjectId(userOnFeed));
            }
            if (!other.matches.some((id) => id.toString() === myId)) {
                other.matches.push(new mongoose_1.default.Types.ObjectId(myId));
            }
            await other.save();
        }
        await me.save();
        res.json({
            match,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.handleRightSwipe = handleRightSwipe;
const handleLeftSwipe = async (req, res, next) => {
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
        const me = await user_1.default.findById(myId);
        if (!me) {
            res.status(404).json({
                error: "User not found",
            });
            return;
        }
        if (!me.swipedUsers.some((id) => id.toString() === userOnFeed)) {
            me.swipedUsers.push(new mongoose_1.default.Types.ObjectId(userOnFeed));
            await me.save();
        }
        res.json({
            success: true,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.handleLeftSwipe = handleLeftSwipe;
//# sourceMappingURL=swipe.js.map
const User = require("../models/user");

// handle right swipe
const handleRightSwipe = async (req, res, next) => {
    try {
        const { userOnFeed } = req.body;
        const myId = req.user.id;

        // validate request
        if (!userOnFeed) {
            return res.status(400).json({
                error: "userOnFeed required",
            });
        }

        // prevent self swipe
        if (String(userOnFeed) === String(myId)) {
            return res.status(400).json({
                error: "Cannot swipe yourself",
            });
        }

        const me = await User.findById(myId);
        const other = await User.findById(userOnFeed);

        // validate users
        if (!me || !other) {
            return res.status(404).json({
                error: "User not found",
            });
        }

        // prevent duplicate swipe
        if (me.swipedUsers.includes(userOnFeed)) {
            return res.json({
                match: false,
                message: "Already swiped",
            });
        }

        // record swipe
        me.swipedUsers.push(userOnFeed);
        me.likes.push(userOnFeed);

        let match = false;

        // check mutual match
        if (other.likes.includes(myId)) {
            match = true;

            if (!me.matches.includes(userOnFeed)) {
                me.matches.push(userOnFeed);
            }

            if (!other.matches.includes(myId)) {
                other.matches.push(myId);
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

// handle left swipe
const handleLeftSwipe = async (req, res, next) => {
    try {
        const { userOnFeed } = req.body;
        const myId = req.user.id;

        // validate request
        if (!userOnFeed) {
            return res.status(400).json({
                error: "userOnFeed required",
            });
        }

        // prevent self swipe
        if (String(userOnFeed) === String(myId)) {
            return res.status(400).json({
                error: "Cannot swipe yourself",
            });
        }

        const me = await User.findById(myId);

        if (!me) {
            return res.status(404).json({
                error: "User not found",
            });
        }

        // record skip only once
        if (!me.swipedUsers.includes(userOnFeed)) {
            me.swipedUsers.push(userOnFeed);
            await me.save();
        }

        res.json({
            success: true,
        });

    } catch (err) {
        next(err);
    }
};

module.exports = {
    handleRightSwipe,
    handleLeftSwipe,
};
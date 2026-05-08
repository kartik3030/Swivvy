const express = require("express");
const router = express.Router();

const requireAuth = require("../middlewares/authenticated");

const {
    handleRightSwipe,
    handleLeftSwipe,
} = require("../controller/swipe");

// right swipe route
router.post("/rightSwipe", requireAuth, handleRightSwipe);

// left swipe route
router.post("/leftSwipe", requireAuth, handleLeftSwipe);

module.exports = router;
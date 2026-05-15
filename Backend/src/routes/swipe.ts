import express from "express";

import requireAuth from "../middlewares/authenticated";

import {
    handleRightSwipe,
    handleLeftSwipe
} from "../controller/swipe";

const router = express.Router();

// right swipe route
router.post("/rightSwipe", requireAuth, handleRightSwipe);

// left swipe route
router.post("/leftSwipe", requireAuth, handleLeftSwipe);

export default router;
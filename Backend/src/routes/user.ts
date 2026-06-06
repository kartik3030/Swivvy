import express from "express";
import limiter from "../middlewares/rateLimiting"
import requireAuth from "../middlewares/authenticated";
import upload from "../middlewares/upload";


import {
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
    handleResetPassword
} from "../controller/user";

const router = express.Router();

// public routes
router.post("/signup", handleSignup);
router.post("/login", limiter, handleLogin);
router.post("/forgot-password", handleForgotPassword)
router.put(
    "/reset-password",
    handleResetPassword
);


// protected routes
router.post("/logout", requireAuth, handleLogout);
router.get("/feed", requireAuth, showUsers);

router.put(
    "/editProfile",
    requireAuth,
    upload.single("profilePhoto"),
    editProfile
);


router.delete("/deleteAccount", requireAuth, deleteAccount);
router.get("/matches", requireAuth, getMatches);
router.get("/me", requireAuth, getCurrentUser);
router.post("/getMessages", requireAuth, handleGetMessage);

export default router;
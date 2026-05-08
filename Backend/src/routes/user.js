const express = require("express");
const router = express.Router();

const requireAuth = require("../middlewares/authenticated");
const upload = require("../middlewares/upload");

const {
    handleSignup,
    handleLogin,
    handleLogout,
    showUsers,
    editProfile,
    deleteAccount,
    getMatches,
    getCurrentUser,
    handleGetMessage,
} = require("../controller/user");

// public routes
router.post("/signup", handleSignup);
router.post("/login", handleLogin);

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

module.exports = router;
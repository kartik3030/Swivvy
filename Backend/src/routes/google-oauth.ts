import express from "express";
import passport from "../config/Google-OAuth";
import { handleGoogleAuth } from "../controller/user";
const router = express.Router()

router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

router.get(
    "/google/callback",
    passport.authenticate("google", { session: false }),
    handleGoogleAuth
);

export default router
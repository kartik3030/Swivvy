"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rateLimiting_1 = __importDefault(require("../middlewares/rateLimiting"));
const authenticated_1 = __importDefault(require("../middlewares/authenticated"));
const upload_1 = __importDefault(require("../middlewares/upload"));
const user_1 = require("../controller/user");
const router = express_1.default.Router();
// public routes
router.post("/signup", user_1.handleSignup);
router.post("/login", rateLimiting_1.default, user_1.handleLogin);
// protected routes
router.post("/logout", authenticated_1.default, user_1.handleLogout);
router.get("/feed", authenticated_1.default, user_1.showUsers);
router.put("/editProfile", authenticated_1.default, upload_1.default.single("profilePhoto"), user_1.editProfile);
router.delete("/deleteAccount", authenticated_1.default, user_1.deleteAccount);
router.get("/matches", authenticated_1.default, user_1.getMatches);
router.get("/me", authenticated_1.default, user_1.getCurrentUser);
router.post("/getMessages", authenticated_1.default, user_1.handleGetMessage);
exports.default = router;
//# sourceMappingURL=user.js.map
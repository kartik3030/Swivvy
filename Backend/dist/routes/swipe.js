"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticated_1 = __importDefault(require("../middlewares/authenticated"));
const swipe_1 = require("../controller/swipe");
const router = express_1.default.Router();
// right swipe route
router.post("/rightSwipe", authenticated_1.default, swipe_1.handleRightSwipe);
// left swipe route
router.post("/leftSwipe", authenticated_1.default, swipe_1.handleLeftSwipe);
exports.default = router;
//# sourceMappingURL=swipe.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectMongoDb = async (url) => {
    return mongoose_1.default.connect(url);
};
exports.default = connectMongoDb;
//# sourceMappingURL=connection.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveAllRooms = exports.joinRoom = exports.sendMessage = void 0;
const messages_1 = __importDefault(require("../models/messages"));
const sendMessage = async (io, socket, msg) => {
    try {
        if (!msg ||
            !msg.roomId ||
            !msg.receiverId ||
            !msg.text ||
            typeof msg.text !== "string" ||
            !msg.text.trim()) {
            socket.emit("message_error", {
                error: "Invalid message payload",
            });
            return;
        }
        const savedMessage = await messages_1.default.create({
            roomId: msg.roomId,
            senderId: msg.receiverId,
            receiverId: msg.receiverId,
            text: msg.text.trim(),
        });
        io.to(msg.roomId).emit("receive_message", savedMessage);
    }
    catch (err) {
        socket.emit("message_error", {
            error: "Failed to send message",
        });
    }
};
exports.sendMessage = sendMessage;
const joinRoom = (socket, roomId) => {
    if (!roomId || typeof roomId !== "string") {
        return;
    }
    socket.join(roomId);
};
exports.joinRoom = joinRoom;
const leaveAllRooms = (socket) => {
    for (const room of socket.rooms) {
        if (room !== socket.id) {
            socket.leave(room);
        }
    }
};
exports.leaveAllRooms = leaveAllRooms;
//# sourceMappingURL=socket.js.map
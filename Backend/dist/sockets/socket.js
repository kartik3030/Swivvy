"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_1 = require("../controller/socket");
const onlineUsers = new Map();
const socketHandler = (io) => {
    io.on("connection", (socket) => {
        const authSocket = socket;
        const userId = String(authSocket.user.id);
        onlineUsers.set(userId, authSocket.id);
        console.log(`User connected: ${userId}`);
        authSocket.on("join_room", (roomId) => {
            (0, socket_1.joinRoom)(authSocket, roomId);
        });
        authSocket.on("leave_all", () => {
            (0, socket_1.leaveAllRooms)(authSocket);
        });
        authSocket.on("send_message", async (msg) => {
            await (0, socket_1.sendMessage)(io, authSocket, msg);
        });
        authSocket.on("disconnect", () => {
            onlineUsers.delete(userId);
            console.log(`User disconnected: ${userId}`);
        });
    });
};
exports.default = socketHandler;
//# sourceMappingURL=socket.js.map
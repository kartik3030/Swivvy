const {
    sendMessage,
    joinRoom,
    leaveAllRooms,
} = require("../controller/socket");

const onlineUsers = new Map();

function socketHandler(io) {
    io.on("connection", (socket) => {
        const userId = String(socket.user.id);

        onlineUsers.set(userId, socket.id);

        console.log(`User connected: ${userId}`);

        socket.on("join_room", (roomId) => {
            joinRoom(socket, roomId);
        });

        socket.on("leave_all", () => {
            leaveAllRooms(socket);
        });

        socket.on("send_message", async (msg) => {
            await sendMessage(io, socket, msg);
        });

        socket.on("disconnect", () => {
            onlineUsers.delete(userId);
            console.log(`User disconnected: ${userId}`);
        });
    });
}

module.exports = socketHandler;
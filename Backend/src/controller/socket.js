const Message = require("../models/messages");

async function sendMessage(io, socket, msg) {
    try {
        if (
            !msg ||
            !msg.roomId ||
            !msg.receiverId ||
            !msg.text ||
            typeof msg.text !== "string" ||
            !msg.text.trim()
        ) {
            return socket.emit("message_error", {
                error: "Invalid message payload",
            });
        }

        const savedMessage = await Message.create({
            roomId: msg.roomId,
            senderId: socket.user.id,
            receiverId: msg.receiverId,
            text: msg.text.trim(),
        });

        io.to(msg.roomId).emit("receive_message", savedMessage);

    } catch (err) {
        socket.emit("message_error", {
            error: "Failed to send message",
        });
    }
}

function joinRoom(socket, roomId) {
    if (!roomId || typeof roomId !== "string") {
        return;
    }

    socket.join(roomId);
}

function leaveAllRooms(socket) {
    for (const room of socket.rooms) {
        if (room !== socket.id) {
            socket.leave(room);
        }
    }
}

module.exports = {
    sendMessage,
    joinRoom,
    leaveAllRooms,
};
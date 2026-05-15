import { Server, Socket } from "socket.io";
import Message from "../models/messages";

interface AuthSocket extends Socket {
    user: {
        id: string;
    };
}

interface MessagePayload {
    roomId: string;
    receiverId: string;
    text: string;
}

const sendMessage = async (
    io: Server,
    socket: AuthSocket,
    msg: MessagePayload
): Promise<void> => {
    try {
        if (
            !msg ||
            !msg.roomId ||
            !msg.receiverId ||
            !msg.text ||
            typeof msg.text !== "string" ||
            !msg.text.trim()
        ) {
            socket.emit("message_error", {
                error: "Invalid message payload",
            });
            return;
        }

        const savedMessage = await Message.create({
            roomId: msg.roomId,
            senderId: msg.receiverId,
            receiverId: msg.receiverId,
            text: msg.text.trim(),
        });

        io.to(msg.roomId).emit("receive_message", savedMessage);

    } catch (err) {
        socket.emit("message_error", {
            error: "Failed to send message",
        });
    }
};

const joinRoom = (
    socket: AuthSocket,
    roomId: string
): void => {
    if (!roomId || typeof roomId !== "string") {
        return;
    }

    socket.join(roomId);
};

const leaveAllRooms = (socket: AuthSocket): void => {
    for (const room of socket.rooms) {
        if (room !== socket.id) {
            socket.leave(room);
        }
    }
};

export {
    sendMessage,
    joinRoom,
    leaveAllRooms,
};
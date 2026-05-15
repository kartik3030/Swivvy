import { Server, Socket } from "socket.io";

import {
    sendMessage,
    joinRoom,
    leaveAllRooms,
} from "../controller/socket";

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

const onlineUsers = new Map<string, string>();

const socketHandler = (io: Server): void => {
    io.on("connection", (socket: Socket) => {
        const authSocket = socket as AuthSocket;
        const userId = String(authSocket.user.id);

        onlineUsers.set(userId, authSocket.id);

        console.log(`User connected: ${userId}`);

        authSocket.on("join_room", (roomId: string) => {
            joinRoom(authSocket, roomId);
        });

        authSocket.on("leave_all", () => {
            leaveAllRooms(authSocket);
        });

        authSocket.on(
            "send_message",
            async (msg: MessagePayload): Promise<void> => {
                await sendMessage(io, authSocket, msg);
            }
        );

        authSocket.on("disconnect", () => {
            onlineUsers.delete(userId);
            console.log(`User disconnected: ${userId}`);
        });
    });
};

export default socketHandler;
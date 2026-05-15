import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";

import socketAuth from "../middlewares/socket";
import socketHandler from "../sockets/socket";

const initSocket = (server: HttpServer): SocketIOServer => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            credentials: true,
        },
        transports: ["websocket"],

        pingTimeout: 60000,
        pingInterval: 25000,
    });

    io.use(socketAuth);

    socketHandler(io);

    return io;
};

export default initSocket;
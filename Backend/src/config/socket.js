const { Server } = require("socket.io");
const socketAuth = require("../middlewares/socket");
const socketHandler = require("../sockets/socket");

function initSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            credentials: true,
        },
        transports: ["websocket"],
    });

    io.engine.pingTimeout = 60000;
    io.engine.pingInterval = 25000;

    io.use(socketAuth);

    socketHandler(io);

    return io;
}

module.exports = initSocket;
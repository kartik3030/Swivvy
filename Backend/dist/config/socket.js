"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const socket_1 = __importDefault(require("../middlewares/socket"));
const socket_2 = __importDefault(require("../sockets/socket"));
const initSocket = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            credentials: true,
        },
        transports: ["websocket"],
        pingTimeout: 60000,
        pingInterval: 25000,
    });
    io.use(socket_1.default);
    (0, socket_2.default)(io);
    return io;
};
exports.default = initSocket;
//# sourceMappingURL=socket.js.map
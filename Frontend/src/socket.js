import { io } from "socket.io-client";
import { BASE_URL } from "./api";

const socket = io(BASE_URL, {
    withCredentials: true,
    transports: ["websocket"],
});

export default socket;
import { io } from "socket.io-client";
import API_URL from "./api";

const socket = io(API_URL, {
    autoConnect: false,
    withCredentials: true,
    transports: ["websocket"],
});

export default socket;

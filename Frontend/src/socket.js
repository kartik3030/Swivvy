import { io } from "socket.io-client";
import API_URL from "./api";

// extract token safely (mobile + cross-origin)
const getToken = () => {
    return document.cookie
        .split("; ")
        .find(c => c.startsWith("token="))
        ?.split("=")[1];
};

const socket = io(API_URL, {
    withCredentials: true,
    transports: ["polling", "websocket"],   // required for Render + mobile
    auth: {
        token: getToken(),                  // fallback when cookies are blocked
    },
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    timeout: 20000,
});

export default socket;

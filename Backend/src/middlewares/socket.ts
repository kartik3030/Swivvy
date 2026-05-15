import jwt from "jsonwebtoken";
import cookie from "cookie";
import { Socket } from "socket.io";

interface AuthSocket extends Socket {
    user: {
        id: string;
        email: string;
    };
}

interface JwtPayload {
    id: string;
    email: string;
}

const socketAuth = (
    socket: AuthSocket,
    next: (err?: Error) => void
): void => {
    try {
        const rawCookies = socket.request.headers.cookie;

        if (!rawCookies) {
            next(new Error("Authentication failed"));
            return;
        }

        const parsedCookies = cookie.parse(rawCookies);
        const token = parsedCookies.token;

        if (!token) {
            next(new Error("Authentication failed"));
            return;
        }

        if (!process.env.JWT_SECRET) {
            next(new Error("JWT_SECRET missing"));
            return;
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        ) as JwtPayload;

        socket.user = decoded;

        next();

    } catch (err) {
        next(new Error("Invalid token"));
    }
};

export default socketAuth;
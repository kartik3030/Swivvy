const jwt = require("jsonwebtoken");
const cookie = require("cookie");

function socketAuth(socket, next) {
    try {
        const rawCookies = socket.request.headers.cookie;

        if (!rawCookies) {
            return next(new Error("Authentication failed"));
        }

        const parsedCookies = cookie.parse(rawCookies);
        const token = parsedCookies.token;

        if (!token) {
            return next(new Error("Authentication failed"));
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        socket.user = decoded;

        next();

    } catch (err) {
        next(new Error("Invalid token"));
    }
}

module.exports = socketAuth;
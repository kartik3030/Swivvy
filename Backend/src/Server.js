require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const dns = require("dns");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const connectMongoDb = require("./connection");
const requireAuth = require("./middlewares/authenticated");
const userRoute = require("./routes/user");
const swipeRoute = require("./routes/swipe");
const Message = require("./models/messages");

const app = express();
const PORT = process.env.PORT || 3000;

// custom DNS
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// middlewares
app.use(cookieParser());

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve uploaded files
const uploadsDir = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsDir));

// routes
app.use("/api", userRoute);
app.use("/api/swipe", swipeRoute);


// create HTTP server
const server = http.createServer(app);

// socket setup
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
    },
    transports: ["websocket"],
});

io.engine.pingTimeout = 60000;
io.engine.pingInterval = 25000;

const onlineUsers = new Map();

// socket auth
io.use((socket, next) => {
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
});

// socket events
io.on("connection", (socket) => {
    const userId = String(socket.user.id);

    onlineUsers.set(userId, socket.id);

    socket.on("leave_all", () => {
        for (const room of socket.rooms) {
            if (room !== socket.id) {
                socket.leave(room);
            }
        }
    });

    socket.on("join_room", (roomId) => {
        if (!roomId || typeof roomId !== "string") {
            return;
        }

        socket.join(roomId);
    });

    socket.on("send_message", async (msg) => {
        try {
            if (
                !msg ||
                !msg.roomId ||
                !msg.receiverId ||
                !msg.text ||
                typeof msg.text !== "string" ||
                !msg.text.trim()
            ) {
                return socket.emit("message_error", {
                    error: "Invalid message payload",
                });
            }

            const savedMessage = await Message.create({
                roomId: msg.roomId,
                senderId: socket.user.id,
                receiverId: msg.receiverId,
                text: msg.text.trim(),
            });

            io.to(msg.roomId).emit(
                "receive_message",
                savedMessage
            );

        } catch {
            socket.emit("message_error", {
                error: "Failed to send message",
            });
        }
    });

    socket.on("disconnect", () => {
        onlineUsers.delete(userId);
    });
});

// global error handler
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        error: "Internal server error",
    });
});

// start server
async function startServer() {
    try {
        await connectMongoDb(process.env.MONGO_URI);

        console.log("MongoDB connected");

        server.listen(PORT, () => {
            console.log(
                `Server running on http://localhost:${PORT}`
            );
        });

    } catch (err) {
        console.error("Database connection failed:", err);
        process.exit(1);
    }
}

startServer();
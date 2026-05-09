require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dns = require("dns");
const http = require("http");
const path = require("path");

const connectMongoDb = require("./connection");
const initSocket = require("./config/socket");

const userRoute = require("./routes/user");
const swipeRoute = require("./routes/swipe");

const app = express();
const PORT = process.env.PORT || 3000;

dns.setServers(["8.8.8.8", "1.1.1.1"]);

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

const uploadsDir = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsDir));

app.use("/api", userRoute);
app.use("/api/swipe", swipeRoute);

app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        error: "Internal server error",
    });
});

const server = http.createServer(app);

initSocket(server);

async function startServer() {
    try {
        await connectMongoDb(process.env.MONGO_URI);

        console.log("MongoDB connected");

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (err) {
        console.error("Database connection failed:", err);
        process.exit(1);
    }
}

startServer();
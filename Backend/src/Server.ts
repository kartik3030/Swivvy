import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dns from "dns";
import http from "http";
import path from "path";

import connectMongoDb from "./connection";
import initSocket from "./config/socket";

import userRoute from "./routes/user";
import swipeRoute from "./routes/swipe";

const app = express();

const PORT = process.env.PORT || 3000;

dns.setServers(["8.8.8.8", "1.1.1.1"]);

app.use(cookieParser());

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsDir = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsDir));

app.use("/api", userRoute);
app.use("/api/swipe", swipeRoute);

app.use(
    (
        err: Error,
        req: Request,
        res: Response,
        next: NextFunction
    ): void => {
        console.error(err);

        res.status(500).json({
            error: "Internal server error"
        });
    }
);

const server = http.createServer(app);

initSocket(server);

async function startServer(): Promise<void> {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI missing");
        }

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
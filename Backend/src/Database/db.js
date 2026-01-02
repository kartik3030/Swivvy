const mongoose = require("mongoose");

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not defined");
    }

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            autoIndex: false,
            serverSelectionTimeoutMS: 10000,
        });
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        // ensure predictable shutdown in production
        process.exit(1);
    }
};

module.exports = connectDB;

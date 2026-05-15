import mongoose from "mongoose";

const connectMongoDb = async (url: string): Promise<typeof mongoose> => {
    return mongoose.connect(url);
};

export default connectMongoDb;
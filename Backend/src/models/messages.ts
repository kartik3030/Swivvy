import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessage extends Document {
    roomId: string;
    senderId: string;
    receiverId: string;
    text: string;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const messageSchema = new Schema < IMessage > (
    {
        roomId: {
            type: String,
            required: true,
            index: true,
        },

        senderId: {
            type: String,
            required: true,
        },

        receiverId: {
            type: String,
            required: true,
        },

        text: {
            type: String,
            required: true,
            trim: true,
        },

        read: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Message: Model<IMessage> = mongoose.model < IMessage > (
    "Message",
    messageSchema
);

export default Message;
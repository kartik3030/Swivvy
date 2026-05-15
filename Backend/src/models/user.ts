import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IUser extends Document {
    FName: string;
    LName: string;
    email: string;
    password: string;
    country: string;
    bio: string;
    skills: string[];
    role: string;
    profilePhoto: string;
    likes: Types.ObjectId[];
    matches: Types.ObjectId[];
    swipedUsers: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        FName: {
            type: String,
            required: true,
            trim: true,
        },

        LName: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },

        password: {
            type: String,
            required: true,
        },

        country: {
            type: String,
            default: "",
        },

        bio: {
            type: String,
            default: "",
        },

        skills: {
            type: [String],
            default: [],
        },

        role: {
            type: String,
            default: "user",
        },

        profilePhoto: {
            type: String,
            default:
                "https://i.pinimg.com/736x/7e/8c/81/7e8c8119bf240d4971880006afb7e1e6.jpg",
        },

        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
                default: [],
            },
        ],

        matches: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
                default: [],
            },
        ],

        swipedUsers: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
                default: [],
            },
        ],
    },
    {
        timestamps: true,
    }
);

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
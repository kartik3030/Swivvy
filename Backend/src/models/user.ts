import mongoose, {
    Schema,
    Document,
    Model,
    Types,
} from "mongoose";

export interface IUser extends Document {
    FName: string;
    LName: string;
    email: string;
    password: string;
    googleId: string;
    country: string;
    bio: string;
    skills: string[];
    role: string;
    profilePhoto: string;
    profilePhotoPublicId: string;
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
            default: "",
        },

        googleId: {
            type: String,
            default: "",
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

        profilePhotoPublicId: {
            type: String,
            default: "",
        },

        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        matches: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        swipedUsers: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        timestamps: true,
    }
);

const User: Model<IUser> = mongoose.model<IUser>(
    "User",
    userSchema
);

export default User;
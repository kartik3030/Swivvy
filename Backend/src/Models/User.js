const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
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

        date: {
            type: Date,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },


        password: {
            type: String,
            required: true,
        },

        country: {
            type: String,
            required: true,
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

        /* ================= SWIPE LOGIC ================= */

        // Users this user swiped RIGHT on
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        // Users with MUTUAL right swipe
        matches: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        swipedUsers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]

    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

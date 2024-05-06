const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        message: {
            type: {
                type: Number,
            },
            body: {
                type: String,
                required: true,
            },
            registrationId: {
                type: Number,
            },
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false,
        },
        channel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Channel',
            required: false,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model("Message", messageSchema);
const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    isRead: {
        type: Boolean,
    },
    createdAt: {
        type: Date,
        default: new Date(new Date().getTime()),
    },
});

module.exports = mongoose.model("Notification", notificationSchema);

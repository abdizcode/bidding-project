const mongoose = require('mongoose')

const auctionResultSchema = new mongoose.Schema({
    auctionId: { type: String, required: true },
    winners: [
        {
            userId: { type: String, required: true },
            amount: { type: Number, required: true },
            status: { type: String, enum: ["pending", "paid", "skipped"], default: "pending" },
        },
    ],
    currentWinnerIndex: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AuctionResult", auctionResultSchema);
 
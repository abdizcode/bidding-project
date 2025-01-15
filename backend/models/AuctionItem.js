const mongoose = require("mongoose");

const auctionItemSchema = mongoose.Schema({
	itemImage: {type: String},
	title: { type: String, required: true,},
	address: { type: String, required: true,},
	description: {type: String,required: true,},
	startingBid: {type: Number,required: true,},
	endDate: {type: Date,required: true,},
	createdBy: {type: mongoose.Schema.Types.ObjectId,ref: "User",},
	createdAt: {type: Date,default: new Date(new Date().getTime()),},
	updatedAt: {type: Date,default: new Date(new Date().getTime()),},
});

module.exports = mongoose.model("AuctionItem", auctionItemSchema);

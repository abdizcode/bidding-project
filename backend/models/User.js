const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
	username: { type: String,required: true,},
	role: {type: String, default: "User"},
	email: {type: String, required: true, unique: true,},
	password: {type: String, required: true,},
	createdAt: { type: Date, default: new Date(new Date().getTime()),},
	isFullyRegistered: { type: Boolean, default: false },
	approvalStatus:{
		type:String ,
		enum:["pending","approved","rejected"], 
		default: "pending"
	},
	rejectionReason: {type:String},
	resubmited: {type: Boolean, default: false},
	phone: { type: String },
	address: { type: String },
	tin: {type: String},
	idImage: { filename: String, filepath: String, mimetype: String },
	taxCertificate: { filename: String, filepath: String, mimetype: String },
	businessLicense: { filename: String, filepath: String, mimetype: String },
	balance:{type: Number, default: 0},
	payments: [
        {
            auctionId: { type: String, required: true },
            amount: { type: Number, required: true },
            payedFor: { type: String, enum: ["cpo", "final"], default: "cpo" },
			createdAt: { type: Date, default: new Date() },
			tx_ref: { type: String, required: true },
        },
    ],
});

module.exports = mongoose.model("User", userSchema);

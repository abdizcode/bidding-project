const mongoose = require("mongoose");

const complaintSchema  = mongoose.Schema({
	subject: { type: String,required: true,},
	type: {type: String, required: true,},
	body: {type: String, required: true,},
});

module.exports = mongoose.model("Complaint", complaintSchema );
require('dotenv').config();
const bcrypt = require("bcryptjs");
const axios = require('axios');
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Complaint = require("../models/Complaint");
const AuctionItem = require("../models/AuctionItem");
const Notification = require("../models/Notification");
const Bid = require("../models/Bid");

const registerUser = async (req, res) => {
	const { username, email, password, confirmPassword } = req.body;

	try {
		if (!username || !email || !password || !confirmPassword) {
			return res.status(400).json({ message: "All fields are required" });
		}

		const userExists = await User.findOne({ email });

		if (userExists) {
			return res.status(400).json({ message: "User already exists" });
		}

		if (password !== confirmPassword) {
			return res.status(400).json({ message: "Passwords do not match" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = await User.create({
			username,
			email,
			password: hashedPassword,
		});

		res.status(201).json({
			id: user._id,
			username: user.username,
			email: user.email,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const loginUser = async (req, res) => {
	const { email, password } = req.body;

	try {
		if (!email || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ message: "User doesn't exist" });
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return res.status(400).json({ message: "Invalid password" });
		}

		const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
			expiresIn: "1d",
		});

		res.cookie("jwt", token, {
			httpOnly: false,
			expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
			sameSite: "none",
			secure: true,
		});

		res.status(200).json({ user });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const getProfile = async (req, res) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decoded = jwt.decode(token, process.env.JWT_SECRET);
		if (!decoded) {
			return res.status(401).json({ message: "Invalid token" });
		}
		const { id } = decoded;

		const user = await User.findById(id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json({
			id: user._id,
			username: user.username,
			email: user.email,
			role: user.role,
			phone: user.phone,
			createdAt: user.createdAt,
			tin: user.tin,
			taxCertificate: user.taxCertificate,
			businessLicense: user.businessLicense,
			isApproved: user.isApproved,
			isFullyRegistered: user.isFullyRegistered,
			idImage: user.idImage,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const logoutUser = async (req, res) => {
	try {
		res.cookie("jwt", "", {
			httpOnly: false,
			secure: true,
			sameSite: "none",
			expires: new Date(0),
		});
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const completeRegister = async (req, res) => {
	try {

		const { id } = req.params;
		const { phone, address, tin } = req.body;

		// Find the user
		const user = await User.findById(id);
		if (!user) return res.status(404).json({ message: "User not found" });

		// Update user details
		user.phone = phone;
		user.address = address;
		user.tin = tin;
		user.idImage = req.files.idImage[0];
		user.taxCertificate = req.files.taxCertificate[0];
		user.businessLicense = req.files.businessLicense[0];
		user.isFullyRegistered = true;

		await user.save();

		res.status(200).json({ message: "User registration completed", user });
	} catch (error) {
		res.status(500).json({ message: "Error completing registration", error });
		console.log(error)
	}
}

const getUsers = async (req, res) => {
	try {
		const allUsers = await User.find({ role: { $ne: 'Admin' } });
		res.status(200).json(allUsers);

	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}
const getUser = async (req, res) => {
	const { id } = req.params;
	try {
		const user = await User.findById(id);
		if (!user) {
			return res.status(404).json({ message: "user item not found" });
		}
		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}
const userApprove = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findById(id);

		// Find the user
		if (!user) return res.status(404).json({ message: "User not found" });

		// Update user details

		user.approvalStatus = "approved";

		await Notification.create({
			userId: id,
			message: `you have been succefuly approven!!`,
			type: 'user_approval',
			isRead: false,
		})

		await user.save();
		res.status(200).json({ message: "User registration completed" });

	} catch (error) {
		res.status(500).json({ message: "Error completing registration", error });
		console.log(error)
	}

}
const rejectUser = async (req, res) => {
	const { id } = req.params; // User ID from the request params
	const { reason } = req.body; // Rejection reason from the request body

	try {
		// Find the user by ID
		const user = await User.findById(id);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		if (!reason || reason.trim() === "") {
			return res.status(400).json({ message: "Rejection reason is required" });
		}

		// Update user's approval status and add rejection reason
		user.approvalStatus = "rejected";
		user.rejectionReason = reason;

		// Save the changes
		await user.save();

		res.status(200).json({ message: "User rejected successfully", user });
	} catch (error) {
		console.error("Error rejecting user:", error);
		res.status(500).json({ message: "Internal server error" });
	}

}

const userCount = async (req, res) => {
	try {
		const now = new Date()
		const userCount = await User.countDocuments();
		const activeAuctionsCount = await AuctionItem.countDocuments({ endDate: { $gte: now } });;
		const activeAuctions = await AuctionItem.find({ endDate: { $gte: now } });
		const aucCount = await AuctionItem.countDocuments();
		res.status(200).json({ activeAuctionsCount, activeAuctions, aucCount, userCount });
	} catch (error) {
		console.error("Error fetching active auctions count:", error);
		res.status(500).json({ error: "Failed to fetch active auctions count" });
	}
}

const userComplaint = async (req, res) => {
	try {
		const newComplaint = new Complaint(req.body);
		await newComplaint.save();
		res.status(201).json({ message: "Complaint submitted successfully" });
	} catch (error) {
		res.status(500).json({ error: "Failed to submit complaint" });
	}
}

const fetchComplaint = async (req, res) => {
	try {
		const complaints = await Complaint.find();
		res.status(200).json(complaints);
	} catch (error) {
		res.status(500).json({ error: "Failed to simply fetch complaints" });
	}
}

const refresh = async (req, res) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decoded = jwt.decode(token, process.env.JWT_SECRET);
		if (!decoded) {
			return res.status(401).json({ message: "Invalid token" });
		}
		const { id } = decoded;

		const user = await User.findById(id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json({ user });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const deleteUser = async (req, res) => {
	const { id } = req.params;

	try {
		const user = await User.findById(id);

		if (!user) {
			return res.status(404).json({ message: "user not found" });
		}

		await AuctionItem.deleteMany({ createdBy: id });

		// Delete bids placed by the user
		await Bid.deleteMany({ userId: id });

		// Remove the user
		await User.deleteOne({ _id: id });

		res.json({ message: "User and related items removed successfully" });
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: error.message });
	}
};

const acceptPayment = async (req, res) =>{
	const {
		amount, currency, email, first_name, last_name, phone_number, tx_ref,
	  } = req.body;
	
	  const payload = {
		amount,
		currency,
		email,
		first_name,
		last_name,
		phone_number,
		tx_ref,
		callback_url: 'http://localhost:5173/about',
		return_url: 'http://localhost:5173/auctions',
		customization: {
		  title: 'Payment for your service',
		  description: 'Payment description',
		},
	  };
	
	  try {
		const response = await axios.post(
		  'https://api.chapa.co/v1/transaction/initialize',
		  payload,
		  {
			headers: {
			  Authorization: `Bearer ${process.env.CHAPA_AUTH_KEY}`,
			  'Content-Type': 'application/json',
			},
		  }
		);
		res.json(response.data);
	  } catch (error) {
		console.log(error)
		res.status(500).json({ error: 'Payment initialization failed on backend' });
	  }
}

module.exports = {
	registerUser,
	loginUser,
	getProfile,
	logoutUser,
	completeRegister,
	getUsers,
	getUser,
	userApprove,
	userCount,
	userComplaint,
	fetchComplaint,
	refresh,
	deleteUser,
	rejectUser,
	acceptPayment
};

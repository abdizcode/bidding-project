require('dotenv').config();
const bcrypt = require("bcryptjs");
const axios = require('axios');
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Complaint = require("../models/Complaint");
const AuctionItem = require("../models/AuctionItem");
const Notification = require("../models/Notification");
const Bid = require("../models/Bid");
const Account = require('../models/Account');

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

		res.status(201).json({});
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

		res.status(200).json({ user });
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
		console.log("user User registration completed")
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

const updateProfile = async (req, res) => {
	try {
		const userId = req.params.id;
		const { username, email, phone, address, tinNumber } = req.body;

		// Build updated user data
		let updatedData = {
			username,
			email,
			phone,
			address,
			tin: tinNumber,
			resubmited: true,
			approvalStatus: "pending",
		};

		// Attach new files if uploaded
		if (req.files) {
			if (req.files.idImage) updatedData.idImage = `/uploads/${req.files.idImage.filename}`;
			if (req.files.taxCertificate) updatedData.taxCertificate = `/uploads/${req.files.taxCertificate.filename}`;
			if (req.files.businessLicense) updatedData.businessLicense = `/uploads/${req.files.businessLicense.filename}`;
		}

		// Update user in database
		const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });

		if (!updatedUser) return res.status(404).json({ message: "User not found" });

		res.json({ message: "Profile updated successfully", user: updatedUser });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
}

const finallPayment = async (req, res) => {
	try {
		const {
			amount, currency, email, first_name, last_name, phone_number, tx_ref, auctionId
		} = req.body;

		console.log(req.body);
		const response = await fetch("https://api.chapa.co/v1/transaction/initialize", {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${process.env.CHAPA_AUTH_KEY}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				"amount": parseInt(amount ? amount : 232),
				"currency": currency,
				"email": email,
				"first_name": first_name,
				"last_name": last_name,
				"phone_number": phone_number,
				"tx_ref": tx_ref,
				"callback_url": "http://localhost:5173/about",
				"return_url": new URL(`http://localhost:5173/paymentsuccess/${tx_ref}?aucId=${auctionId}`).href,
				"customization": {
					"title": "Payment for",
					"description": "Service Payment"
				}
			})
		})

		//to save the payment to the user

		const result = await response.json();

		return res.json(result);

	} catch (error) {
		console.log(error.message)
		res.status(500).json({ error: 'Payment initialization failed on backend' });
	}
}
const cpoPayment = async (req, res) => {
	try {
		const { bidAmount, aucId, userId } = req.body;
		console.log(bidAmount);
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		if (user.balance < bidAmount) {
			return res.status(400).json({ message: "Insufficient balance" });
		}
		const cpoAccount = await Account.findOne({ auctionId: aucId });
		if (cpoAccount) {
			cpoAccount.amount += bidAmount;
			await cpoAccount.save();
		} else {
			await Account.create({
				auctionId: aucId,
				amount: bidAmount,
				userId: userId,
				payedFor: "cpo",
			});
		}
		user.balance -= bidAmount;
		await user.save();
		await User.findOneAndUpdate(
			{ userId },
			{
				$push: {
					payments: {
						auctionId: aucId,
						amount: bidAmount,
						payedFor: "cpo",
						createdAt: new Date(),
					},
				},
			}
		);


		// if (result.status === "success") {
		// 	// Save payment in user record
		// 	await User.findOneAndUpdate(
		// 		{ email: email },
		// 		{
		// 			$push: {
		// 				payments: {
		// 					auctionId: aucId,
		// 					amount,
		// 					payedFor: "cpo",
		// 					createdAt: new Date(),
		// 				},
		// 			},
		// 		}
		// 	);
		// }

		return res.json({ message: "Payment successful" });

	} catch (error) {
		console.log(error.message)
		res.status(500).json({ error: 'Payment initialization failed on backend' });
	}
}

const verifyTransaction = async (req, res) => {
    try {
        const { tx_ref, auctionId } = req.body;
        console.log(tx_ref);

        const response = await fetch(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
        	method: "GET",
            headers: {
                "Authorization": `Bearer ${process.env.CHAPA_AUTH_KEY}`,
                'Content-Type': 'application/json',
            }
        });

        const result = await response.json();
        console.log(result);

        if (result.status === "success") {
            // Check if the payment already exists
            const user = await User.findOne({ email: result.data.email });
            const existingPayment = user.payments.find(payment => payment.tx_ref === tx_ref);

            if (!existingPayment) {
                // Save payment in user record
                console.log("saving to the database");
                await User.findOneAndUpdate(
                    { email: result.data.email },
                    {
						$push: {
                            payments: {
                                auctionId: auctionId,
                                amount: result.data.amount,
                                payedFor: "cpo",
                                createdAt: new Date(),
                                tx_ref: tx_ref, // Add tx_ref to the payment object
                            },
                        },
                    }
                );
            } else {
                console.log("Payment already exists in the database");
            }
        }
        console.log("transaction verify successful");
        return res.json(result);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Payment verification failed on backend' });
    }
};

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
	updateProfile,
	finallPayment,
	cpoPayment,
	verifyTransaction,
};

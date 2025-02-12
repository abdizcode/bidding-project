const AuctionItem = require("../models/AuctionItem");
const Bid = require("../models/Bid");
const User = require("../models/User");
const Notification = require("../models/Notification")
const jwt = require("jsonwebtoken");
const AuctionResult = require("../models/AuctionResult");

async function scheduleAuctionEnd(auction) {
    try {
        const timeUntilEnd = new Date(auction.endDate) - new Date();

        if (timeUntilEnd > 0) {
            console.log(`Scheduling auction ${auction._id} to end in ${timeUntilEnd / 1000} seconds`);

            setTimeout(async () => {
                try {
                    const bids = await Bid.find({ auctionItemId: auction._id }).sort({ bidAmount: -1 });
                    console.log(`Auction ${auction._id} ended! Processing winner...`);

                    if (bids.length === 0) {
                        console.log(`No bids found for auction ${auction._id}`);
                        return;
                    }

                    let winners;
                    if (bids.length >= 3) {
                        const topBids = bids.slice(0, 3);
                        winners = topBids.map((bid) => ({
                            userId: bid.userId,
                            amount: bid.bidAmount,
                            status: "pending",
                        }));
                    } else {
                        winners = bids.map((bid) => ({
                            userId: bid.userId,
                            amount: bid.bidAmount,
                            status: "pending",
                        }));
                    }

                    // Create an AuctionResult document
                    const auctionResult = new AuctionResult({
                        auctionId: auction._id,
                        winners,
                        currentWinnerIndex: 0,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    });

                    await auctionResult.save();
                    console.log(`Auction ${auction._id} results stored successfully:`, auctionResult);
                } catch (error) {
                    console.error(`Error processing auction ${auction._id} end:`, error);
                }
            }, timeUntilEnd);
        } else {
            console.log(`Auction ${auction._id} has already ended.`);
        }
    } catch (error) {
        console.error("Error scheduling auction end:", error);
    }
}

const createAuctionItem = async (req, res) => {
	const { title, address, description, startingBid, endDate } = req.body;
	const userId = req.user.id;
	let img_filename = `${req.file.filename}`;

	try {
		const newDate = new Date(new Date(endDate).getTime());
		const auctionItem = await AuctionItem.create({
			itemImage: img_filename,
			title,
			address,
			description,
			startingBid,
			endDate: newDate,
			createdBy: userId,
		});

		await Notification.create({
			userId: userId,
			message: `You have succefuly created a new auction, "${title}" has been created! and ends at "${endDate}"`,
			type: 'your auction is set',
			isRead: false,
		})

		const bidders = await User.find({ isApproved: true, _id: { $ne: userId } });
		const notifications = bidders.map((bidder) => ({
			userId: bidder._id,
			message: `A new auction "${title}" has been created!`,
			type: 'new auction to bid',
			isRead: false,
		}));

		await Notification.insertMany(notifications);

		scheduleAuctionEnd(auctionItem);
		res.status(201).json(auctionItem);
		console.log("succesfull");

	} catch (error) {
		console.log(error)
		res.status(500).json({ message: error.message });
	}
};

const getAuctionItems = async (req, res) => {
	try {
		const auctionItems = await AuctionItem.find();
		res.status(200).json(auctionItems);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getAuctionItemById = async (req, res) => {
	const { id } = req.params;
	try {
		const auctionItem = await AuctionItem.findById(id);
		if (!auctionItem) {
			return res.status(404).json({ message: "Auction item not found" });
		}
		res.status(200).json(auctionItem);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getAuctionItemsByUser = async (req, res) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const { id } = jwt.decode(token, process.env.JWT_SECRET, (err) => {
			if (err) {
				console.log(err);
				return res.status(500).json({ message: err.message });
			}
		});
		const auctionItems = await AuctionItem.find({ createdBy: id });
		res.status(200).json({
			auctionItems,
		});
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ message: error.message });
	}
};

const updateAuctionItem = async (req, res) => {
	const { id } = req.params;
	const { title, description, startingBid, endDate } = req.body;
	const userId = req.user.id;

	try {
		const auctionItem = await AuctionItem.findById(id);

		if (!auctionItem) {
			return res.status(404).json({ message: "Auction item not found" });
		}

		if (auctionItem.createdBy.toString() !== userId) {
			return res.status(403).json({ message: "Unauthorized action" });
		}

		auctionItem.title = title || auctionItem.title;
		auctionItem.description = description || auctionItem.description;
		auctionItem.startingBid = startingBid || auctionItem.startingBid;
		auctionItem.endDate = endDate
			? new Date(new Date(endDate).getTime())
			: auctionItem.endDate;
		auctionItem.updatedAt = new Date(new Date().getTime());
		await auctionItem.save();

		res.json(auctionItem);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const deleteAuctionItem = async (req, res) => {
	const { id } = req.params;
	const userId = req.user.id;
 
	try {
		const auctionItem = await AuctionItem.findById(id);

		if (!auctionItem) {
			return res.status(404).json({ message: "Auction item not found" });
		}

		if (auctionItem.createdBy.toString() !== userId) {
			return res.status(403).json({ message: "Unauthorized action" });
		}

		const bids = await Bid.find({ auctionItemId: id });
		for (const bid of bids) {
			await bid.remove();
		}

		await auctionItem.remove();

		res.json({ message: "Auction item removed" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getAuctionWinner = async (req, res) => {
	const { id } = req.params;
	try {
		const auctionItem = await AuctionItem.findById(id);
		if (!auctionItem) {
			return res
				.status(404)
				.json({ winner: "", message: "Auction item not found" });
		}

		if (new Date(auctionItem.endDate) > new Date(Date.now())) {
			return res
				.status(400)
				.json({ winner: "", message: "Auction has not ended yet" });
		}

		const bids = await Bid.find({ auctionItemId: id }).sort({ bidAmount: -1 });
		if (bids.length === 0) {
			return res
				.status(200)
				.json({ winner: "", message: "No bids found" });
		}

		const isauctionResult = await AuctionResult.find({ auctionId: id })

		if (isauctionResult.length === 0) {

			if (bids.length >= 3) {
				const topBids = await Bid.find({ auctionItemId: id })
					.sort({ bidAmount: -1 }) // Sort by bid amount in descending order
					.limit(3); // Get top 3 bids

				console.log(topBids)
				const winners = topBids.map((bid) => ({
					userId: bid.userId,
					amount: bid.bidAmount,
					status: "pending", // Default status for all winners
				}));

				// Set the first winner's status to pending
				winners[0].status = "pending";

				// Create an AuctionResult document
				const auctionResult = new AuctionResult({
					auctionId: id,
					winners,
					currentWinnerIndex: 0, // Start with the first winner
					createdAt: new Date(),
					updatedAt: new Date(),
				});

				await auctionResult.save();

				console.log("Top three bidders stored successfully:", auctionResult);
			} else {
				const winners = bids.map((bid) => ({
					userId: bid.userId,
					amount: bid.bidAmount,
					status: "pending", // Default status for all winners
				}));
				const auctionResult = new AuctionResult({
					auctionId: id,
					winners,
					currentWinnerIndex: 0, // Start with the first winner
					createdAt: new Date(),
					updatedAt: new Date(),
				});
				await auctionResult.save();
				console.log("less than three bidders stored successfully:", auctionResult);
			}

		}

		let highestBid = bids.reduce(
			(max, bid) => (bid.bidAmount > max.bidAmount ? bid : max),
			bids[0]
		);

		const winner = await User.findById(highestBid.userId);
		if (!winner) {
			return res
				.status(404)
				.json({ winner: "", message: "Winner not found" });
		}

		res.status(200).json({ winner });
	} catch (error) {
		console.error("Error fetching auction winner:", error);
		res.status(500).json({ message: error.message });
	}
};

const getAuctionsWonByUser = async (req, res) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
		const { id } = decodedToken;

		const bidsByUser = await Bid.find({ userId: id });
		const auctionIds = bidsByUser.map((bid) => bid.auctionItemId);

		const uniqueAuctionIds = [...new Set(auctionIds)];

		let wonAuctions = [];

		for (let i = 0; i < uniqueAuctionIds.length; i++) {
			const auctionItemId = uniqueAuctionIds[i];
			const bids = await Bid.find({ auctionItemId });
			let winningBid = bids.reduce(
				(max, bid) => (bid.bidAmount > max.bidAmount ? bid : max),
				bids[0]
			);

			const auctionItem = await AuctionItem.findById(auctionItemId);
			const isAuctionEnded =
				new Date(auctionItem.endDate) <= new Date(Date.now());

			if (isAuctionEnded && winningBid.userId.toString() === id) {
				wonAuctions.push({
					itemImage: auctionItem.itemImage,
					auctionId: auctionItemId,
					title: auctionItem.title,
					description: auctionItem.description,
					winningBid: winningBid.bidAmount,
					endDate: auctionItem.endDate,
				});
			}
		}
		res.status(200).json({ wonAuctions });
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	createAuctionItem,
	getAuctionItems,
	updateAuctionItem,
	deleteAuctionItem,
	getAuctionItemById,
	getAuctionItemsByUser,
	getAuctionWinner,
	getAuctionsWonByUser,
};

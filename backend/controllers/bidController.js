const Bid = require("../models/Bid");
const AuctionItem = require("../models/AuctionItem");
const jwt = require("jsonwebtoken");

const placeBid = async (io, socket, data) => {
    const { auctionItemId, bidAmount, userId } = data;

	if (!auctionItemId || !bidAmount || bidAmount <= 0) {
        socket.emit('bidError', { message: "Invalid bid details" });
        return;
    }

    try {
        const auctionItem = await AuctionItem.findById(auctionItemId);
        if (!auctionItem) {
            socket.emit('bidError', { message: "Auction item not found" });
            return;
        }
        
        if (bidAmount < auctionItem.startingBid) {
            socket.emit('bidError', {
                message: "Bid amount must be greater than or equal to the starting bid",
            });
            return;
        }

        let bid = await Bid.findOne({ auctionItemId, userId });
        if (bid) {
            if (bid.bidAmount < bidAmount) {
                bid.bidAmount = bidAmount;
                await bid.save();
            } else {
                socket.emit('bidError', {
                    message: "New bid must be higher than the current bid",
                });
                return;
            }
        } else {
            bid = await Bid.create({ auctionItemId, userId, bidAmount });
        }

        const bidHistory = await Bid.find({ auctionItemId }).populate("userId", "username");
        io.emit('newBid', { auctionItemId, bids: bidHistory });
    } catch (error) {
        console.error("Error placing bid:", error.message);
        socket.emit('bidError', { message: error.message });
    }
};

const getBidHistory = async (req, res) => {
	const { auctionItemId } = req.params;

	if (!auctionItemId) {
		return res.status(400).json({ message: "Auction item ID is required" });
	}

	try {
		const bids = await Bid.find({ auctionItemId }).populate(
			"userId",
			"username"
		);
		res.status(200).json(bids);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getBidsByUser = async (req, res) => {
	try {
		const token = req.headers.authorization.split(" ")[1];

		const { id } = jwt.decode(token, process.env.JWT_SECRET, (err) => {
			if (err) {
				console.log(err);
				return res.status(500).json({ message: err.message });
			}
		});

		let bids = await Bid.find({ userId: id });
		bids = await Promise.all(
			bids.map(async (bid) => {
				const auctionItem = await AuctionItem.findById(
					bid.auctionItemId
				);
				const bidObject = bid.toObject();
				delete bidObject.auctionItemId;
				return {
					...bidObject,
					auctionItem,
				};
			})
		);

		res.status(200).json({
			bids,
		});
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	placeBid,
	getBidHistory,
	getBidsByUser,
};

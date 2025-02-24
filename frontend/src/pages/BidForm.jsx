import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import io from "socket.io-client";
import { useAuth } from "../context/AuthContext";

const socket = io('http://localhost:5000');

const BidForm = () => {
	const { id } = useParams();
	const { user } = useAuth()
	const [ auctionItem, setAuctionItem] = useState(null);
	const [bidAmount, setBidAmount] = useState("");
	const [bids, setBids] = useState([]);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const fetchAuctionItem = async () => {
			const res = await axios.get(`/api/auctions/${id}`);
			setAuctionItem(res.data);
			setBidAmount(res.data.startingBid || "");
		};

		fetchAuctionItem();
	}, [id]);

	useEffect(() => {
		const fetchBids = async () => {
			try {
				const res = await axios.get(`/api/bids/${id}`);
				const sortedBids = res.data.sort(
					(a, b) => b.bidAmount - a.bidAmount
				);
				setBids(sortedBids);
			} catch (error) {
				console.error("Error fetching bids:", error);
			}
		};

		fetchBids();
	}, [id]);

	const highestBid = bids.length > 0 ? Math.max(...bids.map((bid) => bid.bidAmount)) : 0;

	// const handleBid = async (e) => {
	// 	e.preventDefault();
	// 	if(bidAmount<highestBid) return(
	// 		setError("your bid amount is lessthan the current highest bid!!")
	// 		)
	// 	try {
	// 		const token = document.cookie
	// 			.split("; ")
	// 			.find((row) => row.startsWith("jwt="))
	// 			?.split("=")[1];
	// 		await axios.post(
	// 			"/api/bids",
	// 			{ auctionItemId: id, bidAmount },
	// 			{ headers: { Authorization: `Bearer ${token}` } }
	// 		);
	// 		navigate(`/auction/${id}`);
	// 	} catch (err) {
	// 		console.error(err);
	// 	}
	// };

	const handleBidSubmit = (e) => {
		e.preventDefault();
		if (bidAmount <= highestBid) return (
			setError("your bid amount is lessthan the current highest bid!!")
		)
		try {
			const userId = user._id; // Retrieve current user ID
			socket.emit('placeBid', { auctionItemId: id, bidAmount, userId });
			navigate(`/auction/${id}`);
		} catch (error) {
			console.error(err);
		}

	};
	if (!auctionItem) return <div>Loading...</div>;

	return (
		<div className="max-w-lg p-6 mx-auto mt-12 text-white bg-gray-800 rounded-lg shadow-md">
			<h2 className="mb-6 text-3xl font-extrabold text-gry-800">
				Place a Bid
			</h2>
			<div className="p-4 mb-3 bg-gray-600 border border-gry-200 rounded-lg">
				<p className="text-lg font-medium text-gry-700">
					Starting Bid Amount:
				</p>
				<p className="text-2xl font-bold text-gry-900">
					{auctionItem.startingBid.toFixed(0)}birr
				</p>
			</div>
			<div className="p-4 mb-6 bg-gray-600 border border-gray-200 rounded-lg">
				<p className="text-lg font-medium text-gra-700">
					Current Highest Bid Amount:
				</p>
				<p className="text-2xl font-bold text-gra-900">
					{highestBid}birr
				</p>
			</div>
			<form onSubmit={handleBidSubmit} className="space-y-4">
				<div>
					<label className="block mb-2 text-lg font-medium text-gry-700">
						Bid Amount
					</label>
					<input
						type="number"
						className="w-full px-4 py-2 border bg-slate-500 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
						value={bidAmount}
						onChange={(e) => setBidAmount(e.target.value)}
						min={auctionItem.startingBid}
						required
					/>
				</div>
				<button
					type="submit"
					className="w-full px-4 py-2 text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
				>
					Place Bid
				</button>
				<p className="text-red-700 font-bold">{error}</p>
			</form>
		</div>
	);
};

export default BidForm;

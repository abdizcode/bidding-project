import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditAuctionItem = () => {
	const { id } = useParams();
	const [auctionItem, setAuctionItem] = useState({
		title: "",
		description: "",
		startingBid: "",
		endDate: "",
	});
	const navigate = useNavigate();

	useEffect(() => {
		const fetchAuctionItem = async () => {
			const res = await axios.get(`/api/auctions/${id}`);
			setAuctionItem(res.data);
		};
		fetchAuctionItem();
	}, [id]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setAuctionItem((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		await axios.put(`/api/auctions/${id}`, auctionItem);
		navigate(`/auction/${id}`);
	};

	return (
		<div className="max-w-4xl mx-auto mt-10 p-8 bg-gray-900 text-white rounded-lg shadow-lg">
			<h2 className="text-3xl font-bold mb-6">Edit Auction Item</h2>
			<form onSubmit={handleSubmit} className="space-y-6">
				<div>
					<label htmlFor="title" className="block text-lg mb-2">
						Title
					</label>
					<input
						type="text"
						id="title"
						name="title"
						value={auctionItem.title}
						onChange={handleChange}
						className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg"
					/>
				</div>
				<div>
					<label htmlFor="description" className="block text-lg mb-2">
						Description
					</label>
					<textarea
						id="description"
						name="description"
						value={auctionItem.description}
						onChange={handleChange}
						className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg"
						rows="4"
					/>
				</div>
				<div>
					<label htmlFor="startingBid" className="block text-lg mb-2">
						Starting Bid
					</label>
					<input
						type="number"
						id="startingBid"
						name="startingBid"
						value={auctionItem.startingBid}
						onChange={handleChange}
						className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg"
					/>
				</div>
				<div>
					<label htmlFor="endDate" className="block text-lg mb-2">
						End Date
					</label>
					<input
						type="datetime-local"
						id="endDate"
						name="endDate"
						value={auctionItem.endDate}
						onChange={handleChange}
						className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg"
					/>
				</div>
				<button
					type="submit"
					className="w-full py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
				>
					Update Auction Item
				</button>
			</form>
		</div>
	);
};

export default EditAuctionItem;

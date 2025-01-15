import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const ITEMS_PER_PAGE = 10;

function AuctionItem() {
	const { id } = useParams();
	const navigate1 = useNavigate()
	const [auctionItem, setAuctionItem] = useState(null);
	const [user, setUser] = useState(null);
	const [bidAmount, setBidAmount] = useState("")
	const [bids, setBids] = useState([]);
	const [winner, setWinner] = useState("");
	const [countdown, setCountdown] = useState({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	});
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [loadingBids, setLoadingBids] = useState(true);
	const navigate = useNavigate();

	const calculateBidCpo = (amounts) => {
		return (amounts * 10) / 100;
	}

	useEffect(() => {
		const fetchAuctionItem = async () => {
			try {
				const res = await axios.get(`/api/auctions/${id}`);
				setAuctionItem(res.data);
				const result = calculateBidCpo(res.data.startingBid)
				setBidAmount(result);
			} catch (error) {
				console.error("Error fetching auction item:", error);
			}
		};

		const fetchUser = async () => {
			const token = document.cookie
				.split("; ")
				.find((row) => row.startsWith("jwt="))
				?.split("=")[1];
			if (token) {
				try {
					const res = await axios.post(
						"/api/users/profile",
						{},
						{
							headers: { Authorization: `Bearer ${token}` },
						}
					);
					setUser(res.data);
				} catch (error) {
					console.error("Error fetching user profile:", error);
				}
			}
		};

		const fetchWinner = async () => {
			try {
				const res = await axios.get(`/api/auctions/winner/${id}`);
				setWinner(res.data.winner);
			} catch (error) {
				if (error.response.data.winner !== "") {
					console.error("Error fetching auction winner:", error);
				}
			}
		};

		fetchAuctionItem();
		fetchUser();
		fetchWinner();
	}, [id]);

	useEffect(() => {
		const fetchBids = async () => {
			setLoadingBids(true);
			try {
				const res = await axios.get(`/api/bids/${id}`);
				const sortedBids = res.data.sort(
					(a, b) => b.bidAmount - a.bidAmount
				);
				setBids(sortedBids);
				setTotalPages(
					Math.ceil(sortedBids.length / ITEMS_PER_PAGE) || 0
				);
			} catch (error) {
				console.error("Error fetching bids:", error);
			} finally {
				setLoadingBids(false);
			}
		};

		fetchBids();
	}, [id]);

	useEffect(() => {
		const updateCountdown = () => {
			if (auctionItem) {
				const endDate = new Date(auctionItem.endDate);
				const now = new Date();
				const timeDiff = endDate - now;

				if (timeDiff > 0) {
					const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
					const hours = Math.floor(
						(timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
					);
					const minutes = Math.floor(
						(timeDiff % (1000 * 60 * 60)) / (1000 * 60)
					);
					const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

					setCountdown({ days, hours, minutes, seconds });
				} else {
					setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
				}
			}
		};

		updateCountdown();
		const interval = setInterval(updateCountdown, 1000);
		return () => clearInterval(interval);
	}, [auctionItem]);

	const handleDelete = async () => {
		try {
			await axios.delete(`/api/auctions/${id}`);
			navigate("/auctions");
		} catch (error) {
			console.error("Error deleting auction item:", error);
		}
	};

	const handlePageChange = (page) => {
		if (page > 0 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const endIndex = startIndex + ITEMS_PER_PAGE;
	const paginatedBids = bids.slice(startIndex, endIndex);

	if (!auctionItem || !user) {
		return <p className="mt-10 text-center text-white">Loading...</p>;
	}

	const highestBid =
		bids.length > 0 ? Math.max(...bids.map((bid) => bid.bidAmount)) : 0;
	const isAuctionEnded =
		countdown.days <= 0 &&
		countdown.hours <= 0 &&
		countdown.minutes <= 0 &&
		countdown.seconds <= 0;

	return (
		<div className="p-4 mx-auto mt-1 text-white rounded-lg shadow-lg z-[-1]">
			{/* Back Button */}
			<div className="flex items-center gap-3 mb-2">
				<button
					onClick={() => navigate1(-1)} // Go back to the previous page
					className="space-x- text-gray-300 hover:text-red-800 focus:outline-none"
				>
					<FaArrowLeft className="" />
				</button>
				<h2 className="text-xl text-start font-bold text-white">
					Auction Detail
				</h2>
			</div>
			<hr className="px-5 mb-5" />
			<div className="flex gap-3 ">
				<div className="w-2/3">
					<div className="flex gap-5 mb-8 ">
						<div className="w-68 mb-4 overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
							<img src={`http://localhost:5000/images/${auctionItem.itemImage}`} alt="" className="h-56 w-68" />
						</div>
						<div className="border rounded-lg p-3 w-full">
							<h2 className="mb-4 text-xl font-bold">{auctionItem.title}</h2>
							<p className="mb-4 ">Description:{" "}
								<span className="font-semibold">
								{auctionItem.description}
								</span>
								</p>
							<p className="mb-4 ">Address:{" "}
								<span className="font-semibold">
									{auctionItem.address}
									</span>
									</p>
							<p className="mb-4 ">
								Starting Bid:{" "}
								<span className="font-semibold">
									{auctionItem.startingBid}birr
								</span>
							</p>
							<p className="mb-4">
								Current Highest Bid:{" "}
								<span className="font-semibold">{highestBid}birr</span>
							</p>
						</div>
					</div>


					<div
						className={`text-center mb-2 p-4 rounded-lg shadow-lg ${isAuctionEnded ? "bg-red-600" : "bg-green-600"
							}`}
					>
						<h3 className="mb-2 text-xl font-bold">
							{isAuctionEnded ? "Auction Ended" : "Time Remaining"}
						</h3>
						<div className="flex justify-center items-center gap-2">
							{Object.entries(countdown).map(([unit, value]) => (
								<div key={unit} className=" ">
									<div className="font-bold text-white bg-gray-800 rounded-lg p-3">
										{value < 10 ? `0${value}` : value}
									</div>
									<div className="">
										{unit.charAt(0).toUpperCase()}
									</div>
								</div>
							))}
						</div>
						{isAuctionEnded && winner && (
							<div className="p-2 mt-4 font-bold text-center text-black bg-yellow-500 rounded-lg">
								<h3 className="text-2xl">
									Congratulations {winner.username}!
								</h3>
								<p className="text-xl">
									You are the winner of this auction!
								</p>
							</div>
						)}
						{isAuctionEnded && !winner && (
							<div className="p-2 mt-4 font-bold text-center text-black bg-yellow-500 rounded-lg">
								<h3 className="text-2xl">No Winner !</h3>
							</div>
						)}
					</div>
				</div>
				<div className="border rounded-lg p-2 w-1/3">
					<h3 className="mb-4 text-xl font-bold">Bids</h3>
					{loadingBids ? (
						<p className="text-xl text-gray-400">Loading bids...</p>
					) : paginatedBids.length ? (
						<div className="mb-6">
							{paginatedBids.map((bid) => {
								return (
									<div
										key={bid._id}
										className="p-2 mb-2 bg-gray-700 rounded-lg"
									>
										<p className="">
											<span className="font-semibold">
												Bidder:
											</span>{" "}
											{bid.userId.username}
										</p>
										<p className="">
											<span className="font-semibold">
												Bid Amount:
											</span>{" "}
											{bid.bidAmount}birr
										</p>
									</div>
								);
							})}
							<div className="flex items-center justify-between mt-6">
								<button
									onClick={() => handlePageChange(currentPage - 1)}
									className={`bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${currentPage === 1 || totalPages === 0
										? "cursor-not-allowed opacity-50"
										: ""
										}`}
									disabled={currentPage === 1 || totalPages === 0}
								>
									Previous
								</button>
								<span className="text-gray-400 ext-center ">
									Page {currentPage} of{" "}
									{totalPages === 0 ? 1 : totalPages}
								</span>
								<button
									onClick={() => handlePageChange(currentPage + 1)}
									className={`bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${totalPages === 0 || currentPage === totalPages
										? "cursor-not-allowed opacity-50"
										: ""
										}`}
									disabled={
										totalPages === 0 || currentPage === totalPages
									}
								>
									Next
								</button>
							</div>
						</div>
					) : (
						<p className="text-xl text-gray-400">No bids yet.</p>
					)}
				</div>
			</div>




			{auctionItem.createdBy === user.id && (
				<div className="flex justify-center mt-6 space-x-4">
					<Link
						to={`/auction/edit/${id}`}
						className="px-6 py-3 text-white bg-blue-700 rounded-lg hover:bg-blue-800"
					>
						Edit
					</Link>
					<button
						onClick={handleDelete}
						className="px-6 py-3 text-white bg-red-700 rounded-lg hover:bg-red-800"
					>
						Delete
					</button>
				</div>
			)}
			{auctionItem.createdBy !== user.id && !isAuctionEnded && user.isFullyRegistered && (
				<Link
					to={`/auction/bid/${id}`}
					className="items-center justify-center block px-6 py-3 mt-6 text-center text-white bg-blue-700 rounded-lg ite hover:bg-blue-800"
				>
					Place a Bid
				</Link>
			)}
			{!user.isFullyRegistered ?
				<div className="flex border p-2 my-2">
					You have to register fully first to bid on auctions
					<Link to={'/fullRegistration'}><p className="text-blue-600 pl-2"> Click Here To Register</p></Link>
				</div> : <></>}
		</div>
	);
}

export default AuctionItem;

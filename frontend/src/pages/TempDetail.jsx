import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

function TempDetail() {
	const { id } = useParams();
	const { user } = useAuth();
	const navigate1 = useNavigate()
	const [auctionItem, setAuctionItem] = useState(null);
	
	const [bids, setBids] = useState([]);
	const [countdown, setCountdown] = useState({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	});
	const [isCountdownEnded, setIsCountdownEnded] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchInitialData = async () => {
			try {
				const auctionRes = await axios.get(`/api/auctions/temp/${id}`);
				setAuctionItem(auctionRes.data);

			} catch (error) {
				console.error("Error fetching initial data:", error);
			} 
		};

		fetchInitialData();

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
					setIsCountdownEnded(true)
				}
			}
		};

		updateCountdown();
		const interval = setInterval(updateCountdown, 1000);
		return () => clearInterval(interval);
	}, [auctionItem]);

	if (!auctionItem) {
		return <p className="mt-10 text-center text-white">Loading...</p>;
	}

	return (
		<div className="p-4 mx-auto mt-1 text-whit rounded-lg shadow-lg z-[-1]">
			{/* Back Button */}
			<div className="flex items-center gap-3 mb-2">
				<button
					onClick={() => navigate1(-1)} // Go back to the previous page
					className="space-x- text-gray-700 hover:text-red-800 focus:outline-none"
				>
					<FaArrowLeft className="" />
				</button>
				<h2 className="text-xl text-start font-bold text-whie">
					Auction Detail
				</h2>
			</div>
			<hr className="px-5 mb-5" />
			<div className="md:flex gap-3 mx-auto justify-center">
				<div className="md:w-2/3">
					<div className="flex md:flex-row flex-col gap-5 mb-8 ">
						<div className="w-68 mb-4 overflow-hidden rounded-lg bg-gray-700 xl:aspect-h-8 xl:aspect-w-7">
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
						</div>
					</div>


					<div
						className={`text-center mb-2 p-4 rounded-lg shadow-lg ${isCountdownEnded ? "bg-red-600" : "bg-green-600"
							}`}
					>
						<h3 className="mb-2 text-xl font-bold">
							{isCountdownEnded ? "Auction Ended" : "Time Remaining"}
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
						
					</div>
                    {!user && (
                        <div className="text-center mt-4">
                            <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2">
                                Login
                            </Link>
                            <Link to="/signup" className="bg-green-500 text-white px-4 py-2 rounded-lg">
                                Sign Up
                            </Link>
                        </div>
                    )}
				</div>
				
			</div>

		</div>
	);
}

export default TempDetail;

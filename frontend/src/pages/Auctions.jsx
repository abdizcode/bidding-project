import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const ITEMS_PER_PAGE = 10;

function AuctionList() {
	const navigate = useNavigate()
	const [auctionItems, setAuctionItems] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);

	useEffect(() => {
		const fetchAuctionItems = async () => {
			const res = await axios.get("/api/auctions");
			setAuctionItems(res.data);
			setSearchResults(res.data);
			setTotalPages(Math.ceil(res.data.length / ITEMS_PER_PAGE));
		};
		fetchAuctionItems();
	}, []);

	useEffect(() => {
		const filterItems = () => {
			const filteredItems = auctionItems.filter((item) => {
				const title = item.title || "";
				const description = item.description || "";
				const startingBid = item.startingBid
					? item.startingBid.toString()
					: "";
				const endDate = item.endDate
					? new Date(item.endDate).toLocaleDateString()
					: "";

				const searchTermString = searchTerm.toLowerCase();

				const matchesTitle = title
					.toLowerCase()
					.includes(searchTermString);
				const matchesDescription = description
					.toLowerCase()
					.includes(searchTermString);
				const matchesStartingBid =
					startingBid.includes(searchTermString);
				const matchesEndDate = endDate.includes(searchTermString);

				return (
					matchesTitle ||
					matchesDescription ||
					matchesStartingBid ||
					matchesEndDate
				);
			});
			setSearchResults(filteredItems);
			setTotalPages(
				Math.ceil(filteredItems.length / ITEMS_PER_PAGE) || 0
			);
			setCurrentPage(1);
		};
		filterItems();
	}, [searchTerm, auctionItems]);

	const handlePageChange = (page) => {
		if (page > 0 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const endIndex = startIndex + ITEMS_PER_PAGE;
	const paginatedItems = searchResults.slice(startIndex, endIndex);

	return (
		<div className="p-4 bg-slate-30 text-white rounded-lg shadow-lg">
			<div className="flex justify-between">
				<h2 className="text-2xl font-bold mb-3">Auction Items</h2>
				<div className="mb-3 flex flex-col gap-4">
					<input
						type="text"
						placeholder="Search..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="p-1 border text-black border-gray-700 rounded-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
					/>
				</div>
			</div>

			<div>
				<div className="container mx-auto">
					<div className="overflow-x-auto">
						<table className="min-w-full bg-slate-200 border border-gray-200">
							<thead>
								<tr className="bg-cyan-100 border-b border-gray-200">
									<th className="text-left p-4 font-medium text-gray-700">Product image</th>
									<th className="text-left p-4 font-medium text-gray-700">Auction Name</th>
									<th className="text-left p-4 font-medium text-gray-700">Address</th>
									<th className="text-left p-4 font-medium text-gray-700">Created at</th>
									<th className="text-left p-4 font-medium text-gray-700">End Date</th>
									<th className="text-left p-4 font-medium text-gray-700">Starting price</th>
								</tr>
							</thead>
							<tbody>
								{paginatedItems.map((item) => (
									<tr key={item._id} className="border-b border-gray-200 hover:bg-gray-50" onClick={() => navigate(`/auction/${item._id}`)}>
										<td>
											<div className="aspect-h-1 aspect-w-1 w-14 overflow-hidden m-2 rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
												<img src={`http://localhost:5000/images/${item.itemImage}`} alt="" className="h-14 w-14 object-cover object-center group-hover:opacity-75" />
											</div>
										</td>

										<td className="p-4 text-gray-700">{item.title}</td>
										<td className="p-4 text-gray-700">{item.address}</td>
										<td className="p-4 text-gray-700">{item.createdAt}</td>
										<td className="p-4 text-gray-700">{item.endDate}</td>
										<td className="p-4 text-gray-700">{item.startingBid}birr</td>
										{/* <td className={`p-4 font-medium ${product.stock === 'In Stock' ? 'text-green-600' : 'text-red-600'}`}>
											{product.stock}
										</td> */}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<div className="flex items-end mx-auto justify-center">
				<div className="mt-10 flex gap-3">
					<button
						onClick={() => handlePageChange(currentPage - 1)}
						className={`bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
							}`}
						disabled={currentPage === 1}
					>
						<FaArrowLeft />
					</button>
					<span className="text-gray-400">
						Page {currentPage} of {totalPages == 0 ? 1 : totalPages}
					</span>
					<button
						onClick={() => handlePageChange(currentPage + 1)}
						className={`bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${totalPages === 0 || currentPage === totalPages
							? "cursor-not-allowed opacity-50"
							: ""
							}`}
						disabled={totalPages === 0 || currentPage === totalPages}
					>
						<FaArrowRight />
					</button>
				</div>
			</div>

		</div>
	);
}

export default AuctionList;

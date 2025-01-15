import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ITEMS_PER_PAGE = 4;
const Bids = () => {
    const [bids, setBids] = useState([]);
    const [totalPagesBids, setTotalPagesBids] = useState(1);
    const [currentPageBids, setCurrentPageBids] = useState(1);
    useEffect(() => {
        const fetchBids = async () => {
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("jwt="))
                ?.split("=")[1];
            if (token) {
                try {
                    const res = await axios.post(
                        "/api/bids/user",
                        {},
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
                    setBids(res.data.bids);
                    setTotalPagesBids(
                        Math.ceil(res.data.bids.length / ITEMS_PER_PAGE)
                    );
                } catch (error) {
                    console.error(error);
                }
            }
        };
        fetchBids()
    }, [])

    const handlePageChange = (page, type) => {
        if (page > 0) {
            if (type === "auctions") {
                if (page <= totalPagesAuctions) setCurrentPageAuctions(page);
            } else if (type === "bids") {
                if (page <= totalPagesBids) setCurrentPageBids(page);
            } else if (type === "won") {
                if (page <= totalPagesWon) setCurrentPageWon(page);
            }
        }
    };

    const startIndexBids = (currentPageBids - 1) * ITEMS_PER_PAGE;
    const endIndexBids = startIndexBids + ITEMS_PER_PAGE;
    const paginatedBids = bids.slice(startIndexBids, endIndexBids);

    return (
        <div className='p-5'>
            <div className="mt-4">
                <h2 className="mb-8 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-indigo-500 to-purple-600">
                    Your Bids
                </h2>

                {paginatedBids.length ? (
                    <div className="flex gap-6 flex-col h-[60vh]">
                        {paginatedBids.map((bid) => (
                            <div
                                key={bid._id}
                                className="overflow-hidden w-full rounded-lg shadow-md bg-gradient-to-br from-gray-800 to-gray-900 hover:shadow-xl "
                            >
                                <div className="p-4 py-2 flex flex-col lg:flex-row justify-between lg:items-center">
                                    <div className="lg:w-20 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                                        <img src={`http://localhost:5000/images/${bid.auctionItem.itemImage}`} alt="" className="lg:h-14 w-full lg:w-20 h-40" />
                                    </div>
                                    <h3 className="mb-3 text-2xl font-bold text-white">
                                        {bid.auctionItem.title}
                                    </h3>
                                    <p className="mb-2 text-lg">
                                        <span className="font-semibold text-cyan-400">
                                            Bid Amount:
                                        </span>{" "}
                                        <span className="font-bold text-green-400">
                                            ${bid.bidAmount}
                                        </span>
                                    </p>
                                    <p className="mb-4">
                                        <span className="font-semibold text-cyan-400">
                                            Bid Date:
                                        </span>{" "}
                                        <span className="text-blue-300">
                                            {new Date(
                                                bid.createdAt
                                            ).toLocaleString()}
                                        </span>
                                    </p>
                                    <Link
                                        to={`/auction/${bid.auctionItem._id}`}
                                        className="inline-block text-center px-6 py-3 text-white transition-all duration-300 transform rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:shadow-md hover:-translate-y-1"
                                    >
                                        View Auction 🔍
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-xl text-gray-600 h-[60vh]">
                        No active bids. Ready to join the
                        excitement?
                    </p>
                )}

                <div className="flex items-center justify-center">
                    <div className="flex mt-10 gap-3">
                        <button
                            onClick={() =>
                                handlePageChange(
                                    currentPageBids - 1,
                                    "bids"
                                )
                            }
                            className={`bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${currentPageBids === 1
                                ? "cursor-not-allowed opacity-50"
                                : ""
                                }`}
                            disabled={currentPageBids === 1}
                        >
                            <FaArrowLeft />
                        </button>
                        <span className="text-gray-400">
                            Page {currentPageBids} of{" "}
                            {totalPagesBids === 0 ? 1 : totalPagesBids}
                        </span>
                        <button
                            onClick={() =>
                                handlePageChange(
                                    currentPageBids + 1,
                                    "bids"
                                )
                            }
                            className={`bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${currentPageBids === totalPagesBids ||
                                totalPagesBids === 0
                                ? "cursor-not-allowed opacity-50"
                                : ""
                                }`}
                            disabled={
                                currentPageBids === totalPagesBids ||
                                totalPagesBids === 0
                            }
                        >
                            <FaArrowRight />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Bids
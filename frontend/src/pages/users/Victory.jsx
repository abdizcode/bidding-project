import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const ITEMS_PER_PAGE = 4;
const Victory = () => {
    const [wonAuctions, setWonAuctions] = useState([]);
    const [currentPageWon, setCurrentPageWon] = useState(1);
    const [totalPagesWon, setTotalPagesWon] = useState(1);
    useEffect(() => {
        const fetchWonAuctions = async () => {
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("jwt="))
                ?.split("=")[1];
            if (token) {
                try {
                    const res = await axios.post(
                        "/api/auctions/won",
                        {},
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
                    setWonAuctions(res.data.wonAuctions);
                    setTotalPagesWon(
                        Math.ceil(res.data.wonAuctions.length / ITEMS_PER_PAGE)
                    );
                } catch (error) {
                    console.error(error);
                }
            }
        };
        fetchWonAuctions()
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
    const startIndexWon = (currentPageWon - 1) * ITEMS_PER_PAGE;
    const endIndexWon = startIndexWon + ITEMS_PER_PAGE;
    const paginatedWon = wonAuctions.slice(startIndexWon, endIndexWon);

    return (
        <div className='p-7'>
            <div className="lg:mt-4 ">
                <h2 className="mb-6 text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r  from-white via-teal-500 to-blue-600">
                    Your Victorious Auctions
                </h2>

                {paginatedWon.length ? (
                    <div className="flex gap-6 flex-col h-[60vh]">
                        {paginatedWon.map((auction) => (
                            <div
                                key={auction.auctionId}
                                className="overflow-hidden transition-all duration-300 rounded-lg shadow-lg hover:shadow-2xl hover:scale-105  bg-gradient-to-br from-gray-800 to-gray-900"
                            >
                                <div className="p-4 py-2 flex flex-col lg:flex-row justify-between lg:items-center ">
                                    <div className="lg:w-20 overflow-hidden rounded-lg bg-gray-200 ">
                                        <img src={`http://localhost:5000/images/${auction.itemImage}`} alt="" className="lg:h-14 lg:w-20 h-40 w-full" />
                                    </div>
                                    <h3 className="mb-3 text-2xl font-bold text-white">
                                        {auction.title}
                                    </h3>
                                    <p className="mb-2 text-lg">
                                        <span className="font-semibold text-yellow-300">
                                            Winning Bid:
                                        </span>{" "}
                                        <br className='hidden lg:block'/>
                                        <span className="font-bold text-green-400">
                                            {auction.winningBid}birr
                                        </span>
                                    </p>
                                    <p className="mb-4">
                                        <span className="font-semibold text-yellow-300">
                                            End Date:
                                        </span>{" "}
                                        <span className="text-blue-400">
                                            {new Date(
                                                auction.endDate
                                            ).toLocaleString()}
                                        </span>
                                    </p>
                                    <Link
                                        to={`/auction/${auction.auctionId}`}
                                        className="inline-block px-3 py-2 text-center font-semibold text-white transition-all duration-300 transform rounded-full bg-gradient-to-r from-yellow-400 to-red-500 hover:from-yellow-500 hover:to-red-600 hover:shadow-md hover:-translate-y-1"
                                    >
                                        View Your Auction🎉
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-xl text-gray-600 animate-bounc h-[60vh]">
                        No victories yet, but your winning moment is
                        coming soon!
                    </p>
                )}

                <div className="flex items-center justify-center">
                    <div className="flex mt-10 gap-3">
                        <button
                            onClick={() =>
                                handlePageChange(
                                    currentPageWon - 1,
                                    "won"
                                )
                            }
                            className={`bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${currentPageWon === 1
                                ? "cursor-not-allowed opacity-50"
                                : ""
                                }`}
                            disabled={currentPageWon === 1}
                        >
                            <FaArrowLeft />
                        </button>
                        <span className="text-gray-400">
                            Page {currentPageWon} of{" "}
                            {totalPagesWon === 0 ? 1 : totalPagesWon}
                        </span>
                        <button
                            onClick={() =>
                                handlePageChange(
                                    currentPageWon + 1,
                                    "won"
                                )
                            }
                            className={`bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${currentPageWon === totalPagesWon ||
                                totalPagesWon === 0
                                ? "cursor-not-allowed opacity-50"
                                : ""
                                }`}
                            disabled={
                                currentPageWon === totalPagesWon ||
                                totalPagesWon === 0
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

export default Victory
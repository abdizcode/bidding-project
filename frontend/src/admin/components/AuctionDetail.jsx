import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ITEMS_PER_PAGE = 10;

const AuctionDetail = () => {

    const { id } = useParams();
    const [auction, setAuction] = useState([]);
    const [winner, setWinner] = useState("");
    const [bids, setBids] = useState([]);
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

    const fetchAuctionItem = async () => {
        try {
            const res = await axios.get(`/api/auctions/${id}`);
            setAuction(res.data);
        } catch (error) {
            console.error("Error fetching auction item:", error);
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

    useEffect(() => {
        fetchAuctionItem();
        fetchWinner();
        fetchBids()
    }, [id]);

    useEffect(() => {
        const updateCountdown = () => {
            if (auction) {
                const endDate = new Date(auction.endDate);
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
    }, [auction]);

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/auctions/${id}`);
            toast.success("Auction item deleted successfully");
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

    const highestBid =
        bids.length > 0 ? Math.max(...bids.map((bid) => bid.bidAmount)) : 0;
    const isAuctionEnded =
        countdown.days <= 0 &&
        countdown.hours <= 0 &&
        countdown.minutes <= 0 &&
        countdown.seconds <= 0;
    return (
        <div className="max-w-screen-xl min-h-screen mx-auto p-6 bg-cyan-700 text-white">
            <h2 className="text-xl font-bold text-white mb-3">Auction Detail</h2>
            <hr className='mx-3 mb-5' />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Product Image */}
                <div className="flex flex-col">
                    <img
                        src={`http://localhost:5000/images/${auction.itemImage}`}
                        alt="image"
                        className="w-full h-52 rounded-lg shadow-md max-w-md"
                    />
                    <div>
                        <h3 className="my-2 text-xl font-bold">Bids</h3>
                        {loadingBids ? (
                            <p className="text-xl text-gray-400">Loading bids...</p>
                        ) : paginatedBids.length ? (
                            <div className="mb-6">
                                {paginatedBids.map((bid) => {
                                    return (
                                        <div
                                            key={bid._id}
                                            className="p-2 mb-4 bg-gray-700 rounded-lg flex gap-5"
                                        >
                                            <p className="text-lg">
                                                <span className="font-semibold">
                                                    Bidder:
                                                </span>{" "}
                                                {bid.userId.username}
                                            </p>
                                            <p className="text-lg">
                                                <span className="font-semibold">
                                                    Bid Amount:
                                                </span>{" "}
                                                ${bid.bidAmount}
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

                {/* Product Info */}
                <div className="flex flex-col bg-cyan-900 p-2">
                    <h1 className="text-xl font-semibold mb-2">Auction Name: <span className='text-slate-200 text-lg'>{auction.title}</span> </h1>
                    <p className="text-xl font-semibold mb-4">Description: <span className='text-slate-200 text-lg'>{auction.description}</span> </p>
                    <p className="text-xl font-semibold mb-4">Starting Bid Amount: <span className='text-slate-200 text-lg'>{auction.startingBid}birr</span> </p>
                    <p className="text-xl font-semibold mb-4">Current Highest Bid: <span className='text-slate-200 text-lg'>{highestBid}birr</span> </p>
                    <p className="text-xl font-semibold mb-4">Status: <span className='text-slate-200 text-lg'>{isAuctionEnded ? "Auction Ended" : "Time Remaining"}</span> </p>
                    <div className=''>
                        <p className="text-xl font-semibold mb-4 flex flex-row">Winner: {!isAuctionEnded ? ' Pendding...'
                            :<span>{winner?`${winner.username}`:' No winner!' }</span>
                            
                            }</p>
                        <p className="text-xl font-semibold mb-4"> 
                        </p>
                    </div>

                    {/* Time counter and the winner */}
                    <div
                        className={`text-center mb-2 p-3 rounded-lg shadow-lg ${isAuctionEnded ? "bg-red-600" : "bg-green-500"
                            }`}
                    >

                        <div className="flex justify-center items-center gap-4">
                            <h3 className="mr-5 text-lg font-bol">
                                Time Counter
                            </h3>
                            {Object.entries(countdown).map(([unit, value]) => (
                                <div key={unit} className="text-lg">
                                    <div className="">
                                        {unit.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="">
                                        {value < 10 ? `0${value}` : value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button onClick={handleDelete} className="px-6 py-3 mt-2 text-white bg-red-700 rounded-lg hover:bg-red-800"
					>
						Delete
					</button>
                </div>
            </div>
        </div>
    )
}

export default AuctionDetail
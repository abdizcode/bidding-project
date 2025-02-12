import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const ITEMS_PER_PAGE = 4;
const UserAuction = () => {
    const navigate = useNavigate()
    const {user} = useAuth()
    const [auctions, setAuctions] = useState([]);
    const [currentPageAuctions, setCurrentPageAuctions] = useState(1);
    const [totalPagesAuctions, setTotalPagesAuctions] = useState(1);

    useEffect(() => {
        const fetchAuctions = async () => {
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("jwt="))
                ?.split("=")[1];
            if (token) {
                try {
                    const res = await axios.post(
                        "/api/auctions/user",
                        {},
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
                    setAuctions(res.data.auctionItems);
                    setTotalPagesAuctions(
                        Math.ceil(res.data.auctionItems.length / ITEMS_PER_PAGE)
                    );
                } catch (error) {
                    console.error(error);
                }
            }
        };
        fetchAuctions();
    }, [])

    const handlePageChange = (page, type) => {
		if (page > 0) {
			if (type === "auctions") {
				if (page <= totalPagesAuctions) setCurrentPageAuctions(page);
			} 
		}
	};

	const startIndexAuctions = (currentPageAuctions - 1) * ITEMS_PER_PAGE;
	const endIndexAuctions = startIndexAuctions + ITEMS_PER_PAGE;
	const paginatedAuctions = auctions.slice(
		startIndexAuctions,
		endIndexAuctions
	);

    const clickCreate = () => {
        if (user.isFullyRegistered) {
            console.log("fullyregister and waiting");
            
            if (user.approvalStatus==="approved") {
                navigate("/auction/create")
            } else if(user.approvalStatus === "rejected") {
                toast.warning("you are rejected Update your profile")
                navigate("/profile")
            }else if(user.approvalStatus === "pending"){
                toast.warning("You are not approved yet!")
            }

        } else {
            toast.error('You have to register first!');
            navigate(`/fullRegistration`)
        }
    }

    return (
        <div className='p-5'>
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-teal-500 to-blue-600">
                    Your Auctions
                </h2>
                <button
                    onClick={clickCreate}
                    className="inline-block px-3 py-2 font-semibold text-white transition-all duration-300 transform rounded-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 hover:shadow-lg hover:-translate-y-1"
                >
                    Create Auction +
                </button>
            </div>
            {paginatedAuctions.length ? (
                <div className="flex gap-3 flex-col md:h-[60vh]">
                    {paginatedAuctions.map((auction) => (
                        <div
                            key={auction._id}
                            className=" w-full rounded-lg shadow-md bg-gradient-to-br from-gray-800 to-gray-900 "
                        >
                            <div className="p-2 flex flex-col lg:flex-row justify-between lg:items-center ">
                                <div className="aspect-h-1 aspect-w-  lg:w-20 overflow-hidden rounded-lg bg-gray-200">
                                    <img src={`http://localhost:5000/images/${auction.itemImage}`} alt="" className="lg:h-14 lg:w-20 w-full h-40" />
                                </div>
                                <h3 className="mb-3 text-2xl font-bold text-white">
                                    {auction.title}
                                </h3>
                                <p className="mb-2 text-lg">
                                    <span className="font-semibold text-teal-400">
                                        Starting Bid:
                                    </span>{" "}
                                    {/* <br className='hidden lg:block'/> */}
                                    <span className="font-bold text-green-400">
                                        {auction.startingBid}birr
                                    </span>
                                </p>
                                <p className="mb-4">
                                    <span className="font-semibold text-teal-400">
                                        End Date:
                                    </span>{" "}
                                    <span className="text-blue-300">
                                        {new Date(
                                            auction.endDate
                                        ).toLocaleString()}
                                    </span>
                                </p>
                                <Link
                                    to={`/auction/${auction._id}`}
                                    className="lg:mr-10 px-4 py-2 text-center text-white rounded-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 hover:shadow-md hover:-translate-y-1"
                                >
                                    View
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-xl text-gray-600 h-[60vh]">
                    No active auctions. Ready to start selling?
                </p>
            )}

            <div className="flex items-end mx-auto justify-center">
                <div className="mt-10 flex gap-3">
                    <button
                        onClick={() =>
                            handlePageChange(
                                currentPageAuctions - 1,
                                "auctions"
                            )
                        }
                        className={`bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${currentPageAuctions === 1
                            ? "cursor-not-allowed opacity-50"
                            : ""
                            }`}
                        disabled={currentPageAuctions === 1}
                    >
                        <FaArrowLeft />
                    </button>
                    <span className="text-gray-400">
                        Page {currentPageAuctions} of{" "}
                        {totalPagesAuctions === 0
                            ? 1
                            : totalPagesAuctions}
                    </span>
                    <button
                        onClick={() =>
                            handlePageChange(
                                currentPageAuctions + 1,
                                "auctions"
                            )
                        }
                        className={`bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${currentPageAuctions ===
                            totalPagesAuctions ||
                            totalPagesAuctions === 0
                            ? "cursor-not-allowed opacity-50"
                            : ""
                            }`}
                        disabled={
                            currentPageAuctions ===
                            totalPagesAuctions ||
                            totalPagesAuctions === 0
                        }
                    >
                        <FaArrowRight />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default UserAuction
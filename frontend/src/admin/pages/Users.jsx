import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

function Users() {
    const ITEMS_PER_PAGE = 10;
    const [user, setUser] = useState([])
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get("/api/users/users");
            setUser(res.data || []);
            setSearchResults(res.data || []);
            setTotalPages(Math.ceil((res.data || []).length / ITEMS_PER_PAGE));
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const filterItems = () => {
            const filteredItems = user.filter((item) => {
                const title = item.username || "";

                const searchTermString = searchTerm.trim().toLowerCase();

                const matchesTitle = title
                    .toLowerCase()
                    .includes(searchTermString);

                return (
                    matchesTitle
                );
            });
            setSearchResults(filteredItems);
            setTotalPages(
                Math.ceil(filteredItems.length / ITEMS_PER_PAGE) || 0
            );
            setCurrentPage(1);
        };
        filterItems();
    }, [searchTerm, user]);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedItems = searchResults.slice(startIndex, endIndex);
    return (
        <div className='flex flex-col min-h-screen rounded bg-cyan-700'>
            <div className='flex flex-col md:flex-row justify-between items-center m-2 gap-2 md:mx-5'>
                <h2 className="text-xl font-bold text-white">Users</h2>
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-1 border border-gray-500 rounded-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
            <hr className='mx-3' />
            <div>
                <div className="container mx-auto p-4">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-white bg-gray-800">
                            <thead>
                                <tr className="bg-gray-700 ">
                                    <th className="text-left p-3 font-medium">Name</th>
                                    <th className="text-left p-3 font-medium">Email</th>
                                    <th className="text-left p-3 font-medium">TIN Number</th>
                                    <th className="text-left p-3 font-medium">Tax Clearace Certeficate</th>
                                    <th className="text-left p-3 font-medium">Business Licence Certeficate</th>
                                    <th className="text-left p-3 font-medium">Status</th>
                                    <th className="text-left p-3 font-medium"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedItems.map((item) => (
                                    <tr key={item._id} className="border-b border-gray-500 hover:bg-gray-700">
                                        <td className="p-3">{item.username}</td>
                                        <td className="p-3">{item.email}</td>
                                        <td className="p-3">{item.tin ? item.tin : "---"}</td>
                                        <td>
                                            <div className="aspect-h-1 aspect-w-1 w-14 overflow-hidden m-2 rounded-lg border xl:aspect-h-8 xl:aspect-w-7">
                                                <img src={item?.taxCertificate?.filename
                                                    ? `http://localhost:5000/images/${item.taxCertificate.filename}`
                                                    : 'http://localhost:5000/images/default.jpg'} alt=""
                                                    className="h-14 w-14 object-cover object-center group-hover:opacity-75" />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="aspect-h-1 aspect-w-1 w-14 overflow-hidden m-2 rounded-lg xl:aspect-h-8 xl:aspect-w-7">
                                                <img src={item?.businessLicense?.filename
                                                    ? `http://localhost:5000/images/${item.businessLicense.filename}`
                                                    : 'http://localhost:5000/images/default.jpg'} alt=" image not found"
                                                    className="h-14 w-14 object-cover border object-center group-hover:opacity-75" />
                                            </div>
                                        </td>
                                        <td className="p-2">
                                            {item.isFullyRegistered ? (
                                                item.approvalStatus === "approved" ? (
                                                    <p className="text-green-600">Approved</p>
                                                ) : item.approvalStatus === "rejected" ? (
                                                    <p className="text-red-600">Rejected</p>
                                                ) : (
                                                    <p className="text-yellow-400">Waiting for approval</p>
                                                )
                                            ) : (
                                                <p className="text-red-400">Not Registered fully yet</p>
                                            )}
                                        </td>
                                        <td className="p-2 text-white ">
                                            <Link to={`/admin/userDetail/${item._id}`} className='bg-blue-600 px-2 rounded shadow-lg'>View</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center">
                <div className="my-6 flex gap-3">
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
    )
}

export default Users
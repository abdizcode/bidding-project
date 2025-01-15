import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const ITEMS_PER_PAGE = 10;

function Auctions() {
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

  const handleDelete = async () => {
		try {
			await axios.delete(`/api/auctions/${id}`);
			navigate("/auctions");
		} catch (error) {
			console.error("Error deleting auction item:", error);
		}
	};

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
    <div className="flex flex-col min-h-screen rounded bg-cyan-700 w-full">
      <div className="flex flex-col md:flex-row justify-between items-center m-1 gap-2 md:m-1 md:mx-2">
        <h2 className="text-xl font-bold text-white">Auction Items</h2>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-1 border border-gray-500 rounded-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <hr className='mx-3'/>
      <div className="container mx-auto p-5 pb-0">
        <div className="overflow-x-auto">
          <table className="min-w-full text-white bg-gray-800 border border-gray-700">
            <thead>
              <tr className="bg-gray-700">
                <th className="text-left p-2 font-medium">Product image</th>
                <th className="text-left p-2 font-medium">Auction Name</th>
                <th className="text-left p-2 font-medium">Created at</th>
                <th className="text-left p-2 font-medium">Starting Bid</th>
                <th className="text-left p-2 font-medium">Address</th>
                <th className="text-left p-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((item) => (
                <tr key={item._id} className="border-b border-gray-500 hover:bg-gray-700">
                  <td>
                    <div className="aspect-h-1 aspect-w-1 w-14 overflow-hidden m-2 rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                      <img src={`http://localhost:5000/images/${item.itemImage}`} alt="" className="h-14 w-14 object-cover object-center group-hover:opacity-75" />
                    </div>
                  </td>

                  <td className="p-2 ">{item.title}</td>
                  <td className="p-2 ">{item.createdAt}</td>
                  <td className="p-2 ">{item.startingBid}birr</td>
                  <td className="p-2 ">{item.address}</td>
                  <td className="p-2 text-white ">
                    <Link to={`/admin/auctionDetail/${item._id}`} className='bg-blue-600 px-3 py-1 rounded shadow-lg'>View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="my-5 flex gap-3">
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

export default Auctions;

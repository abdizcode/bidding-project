// pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { FaUser, FaGavel, FaCogs } from 'react-icons/fa';
import { CiStreamOn } from "react-icons/ci";
import axios from 'axios';
import DashboardCard from './components/DashboardCard';
import { Link } from 'react-router-dom';

const AdminApp = () => {
  const [data, setData] = useState({
    userCount: 0,
    auctionCount: 0,
    activeAuctions: [],
    activeCount: 0,
  })

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axios.get("/api/users/count");

        setData({
          userCount: response.data.userCount,
          auctionCount: response.data.aucCount,
          activeAuctions: response.data.activeAuctions,
          activeCount: response.data.activeAuctionsCount
        })

      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="flex min-h-screen bg-cyan-700 w-full">
      <div className="flex-1 ml- bg-nature p-8">
        <h2 className="text-lg font-bold text-white">Dashboard</h2>
        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          <DashboardCard title="Total Users" value={data.userCount} icon={<FaUser />} />
          <DashboardCard title="Total Auctions" value={data.auctionCount} icon={<FaGavel />} />
          <DashboardCard title="Active Auctions" value={data.activeCount} icon={<CiStreamOn />} />
        </div>
        <div className="mt-8">
          <h3 className="text-xl text-white mb-4">Active Auctions</h3>
          {!data.activeCount==0?
           <table className="w-full text-white bg-gray-800 rounded-lg">
            <thead>
              <tr className="bg-gray-700">
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left lg:block hidden">Starting bid</th>
                <th className="p-4 text-left ">End Date</th>
                <th className="p-4 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {data.activeAuctions.map((item, index) => (
                <tr key={index} className="hover:bg-gray-700">
                  <td className="p-4">{item.title}</td>
                  <td className="p-4 lg:block hidden">{item.startingBid}birr</td>
                  <td>{new Date(item.endDate).toLocaleString()}</td>
                  <td className="p-4">
                    <Link to={`/admin/auctionDetail/${item._id}`} className="text-accent no-underline">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          :
          <p className='text-white '>There is no active auction right now...</p>}
         
        </div>
      </div>
    </div>
  );
};

export default AdminApp;

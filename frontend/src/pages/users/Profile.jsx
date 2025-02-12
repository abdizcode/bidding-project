import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { FaArrowRightLong, FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  // const { user } = useAuth();
  const [user, setUser] = useState(null)

  useEffect(() => {
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
          setUser(res.data.user);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchUser();
  }, [])

  return (
    <div className="flex items-start mt-4 justify-center min-h-screen mx-2">
      {user ? <div className="w-full max-w-xl px-6 py-4 bg-cyan-200 shadow-lg rounded-lg">
        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-gray-700">{user.username}</h1>
          <p className="text-gray-600">{user.email}</p>
        </div>

        <span className="bg-slate-800"><hr className="my-6" /></span>

        {/* User Details */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-600">Details</h2>
          <div>
            <Link to="/images" className="mb-4 text-lg font-semibold text-gray-600 flex items-center gap-2 border border-gray-700 w-36 px-2 rounded">Documents <FaArrowRightLong /></Link>
            {user.isFullyRegistered
              ? <></>
              : <Link to="/fullRegistration" className="mb-4 text-lg font-semibold text-gray-600 flex items-center gap-2 border border-gray-700 w-36 px-1 rounded">Register fully<FaArrowRightLong /></Link>}
              <Link to={`/add-balance`} className="mb-4 text-lg font-semibold text-gray-600 flex items-center gap-2 border border-gray-700 w-36 px-1 rounded">Add Balance<FaPlus /></Link>
          </div>

          <ul className="space-y-4">
            <li className="flex justify-between">
              <span className="font-semibold text-gray-600 text-lg">Status:</span>
              <span>
                {user.isFullyRegistered ? (
                  user.approvalStatus === "approved" ? (
                    <p className="text-green-500">Approved</p>
                  ) : user.approvalStatus === "rejected" ? (
                    <p className="text-red-500 font-semibold">you are Rejected,
                      <Link to="/profileEdit" className="px-2 py-1 text-white underline hover:bg-blue-500">Edit your profile</Link >
                    </p>
                  ) : (
                    <p className="text-red-500">Waiting for approval</p>
                  )
                ) : (
                  <p className="text-red-500">Not Registered fully yet</p>
                )}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="font-semibold text-gray-600 text-lg">Username:</span>
              <span>{user.username}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-semibold text-gray-600 text-lg">Balance:</span>
              <span>{user?.balance?.toFixed(1)}birr</span>
            </li>
            <li className="flex justify-between">
              <span className="font-semibold text-gray-600 text-lg">Role:</span>
              <span>{user.role || "User"}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-semibold text-gray-600 text-lg">Address</span>
              <span>{user.address || "---"}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-semibold text-gray-600 text-lg">Tin Number</span>
              <span>{user.tin || "---"}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-semibold text-gray-600 text-lg">Joined:</span>
              <span>{new Date(user.createdAt).toLocaleDateString() || user.createdAt}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-semibold text-gray-600 text-lg">Phone:</span>
              <span>{user.phone || "---"}</span>
            </li>
          </ul>
        </div>
      </div> : (
        <div className="flex items-center justify-center h-screen bg-gray-900 w-full">
          <div className="w-32 h-32 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
        </div>
      )
      }

    </div>
  );
};

export default Profile;

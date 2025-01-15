import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-lg text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="flex items-start mt-4 justify-center min-h-screen mx-2">
      <div className="w-full max-w-xl px-6 py-4 bg-cyan-700 text-white shadow-lg rounded-lg">
        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-gray-200">{user.username}</h1>
          <p className="text-gray-100">{user.email}</p>
        </div>

        <hr className="my-6" />

        {/* User Details */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-200">Details</h2>
          <div>
            <Link to="/images" className="mb-4 text-lg font-semibold text-gray-200 flex items-center gap-2 border w-36 px-2 rounded">Documents <FaArrowRightLong /></Link>
            {user.isFullyRegistered
            ?<></>
            :<Link to="/fullRegistration" className="mb-4 text-lg font-semibold text-gray-200 flex items-center gap-2 border w-36 px-1 rounded">Register fully<FaArrowRightLong /></Link>}
          </div>

          <ul className="space-y-4">
            <li className="flex justify-between">
              <span className="font-semibold text-gray-200 text-lg">Status:</span>
              <span>
                {user.isFullyRegistered ? (
                  user.approvalStatus === "approved" ? (
                    <p className="text-green-400">Approved</p>
                  ) : user.approvalStatus === "rejected" ? (
                    <p className="text-red-400 font-semibold">you are Rejected,
                      <Link to="/profileEdit" className="px-2 py-1 text-white underline hover:bg-blue-700">Edit your profile</Link >
                    </p>
                  ) : (
                    <p className="text-red-400">Waiting for approval</p>
                  )
                ) : (
                  <p className="text-red-400">Not Registered fully yet</p>
                )}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="font-semibold text-gray-200 text-lg">Username:</span>
              <span>{user.username}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-semibold text-gray-200 text-lg">Role:</span>
              <span>{user.role || "User"}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-semibold text-gray-200 text-lg">Address</span>
              <span>{user.address || "---"}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-semibold text-gray-200 text-lg">Tin Number</span>
              <span>{user.tin || "---"}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-semibold text-gray-200 text-lg">Joined:</span>
              <span>{new Date(user.createdAt).toLocaleDateString() || user.createdAt}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-semibold text-gray-200 text-lg">Phone:</span>
              <span>{user.phone || "---"}</span>
            </li>
          </ul>
        </div>

        {/* Edit Button */}
        {/* <div className="mt-6 text-center">
          <button className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            disabled={user.approvalStatus === "approved"}>
            Edit Profile
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Profile;

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const ProfileEdit = () => {
    const {user} = useAuth()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    tinNumber: "",
    idImage: null,
    taxCertificate: null,
    businessLicense: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    setFormData({ ...formData, [name]: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form Data Submitted:", formData);
  };

  return (
    <div className="max-w-2xl m-4 lg:mx-auto text-white bg-gray-800 shadow-md rounded-md p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">Edit Profile</h2>
      <h3 className="mb-4">Your profile issue: <span className="text-red-600 font-semibold">{user.rejectionReason}</span></h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-500 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-500 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="phone">
            Phone
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-500 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="address">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-500 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
        </div>

        {/* TIN Number */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="tinNumber">
            TIN Number
          </label>
          <input
            type="text"
            id="tinNumber"
            name="tinNumber"
            value={formData.tinNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-500 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
        </div>

        {/* ID Image */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="idImage">
            ID Image
          </label>
          <input
            type="file"
            id="idImage"
            name="idImage"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Tax Certificate */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="taxCertificate">
            Tax Certificate
          </label>
          <input
            type="file"
            id="taxCertificate"
            name="taxCertificate"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Business License */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="businessLicense">
            Business License
          </label>
          <input
            type="file"
            id="businessLicense"
            name="businessLicense"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;

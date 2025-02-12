import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfileEdit = () => {
  const { user } = useAuth();
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    tinNumber: user?.tin || "",
    idImage: user?.idImage || null,
    taxCertificate: user?.taxCertificate || null,
    businessLicense: user?.businessLicense || null,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        tinNumber: user.tin || "",
        idImage: user.idImage || null,
        taxCertificate: user.taxCertificate || null,
        businessLicense: user.businessLicense || null,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    setFormData({ ...formData, [name]: e.target.files[0] });
  };

    const handleSubmit = async (e) => {
      e.preventDefault();
    
      const submitData = new FormData();
      submitData.append("username", formData.username);
      submitData.append("email", formData.email);
      submitData.append("phone", formData.phone);
      submitData.append("address", formData.address);
      submitData.append("tinNumber", formData.tinNumber);
    
      if (formData.idImage instanceof File) {
        submitData.append("idImage", formData.idImage);
      }
      if (formData.taxCertificate instanceof File) {
        submitData.append("taxCertificate", formData.taxCertificate);
      }
      if (formData.businessLicense instanceof File) {
        submitData.append("businessLicense", formData.businessLicense);
      }
    
      try {
        const response = await fetch(`/api/users/update/${user._id}`, {
          method: "PUT",
          body: submitData,
        });
    
        if (!response.ok) throw new Error("Failed to update profile");
    
        const data = await response.json();
        toast.success("Profile updated successfully!");
        navigate("/profile");
      } catch (error) {
        console.error(error);
        alert("Error updating profile.");
      }
    };   
    
  return (
    <div className="max-w-2xl m-4 lg:mx-auto text-white bg-gray-800 shadow-md rounded-md p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">Edit Profile</h2>
      <h3 className="mb-4">
        Your profile issue: <span className="text-red-600 font-semibold">{user.rejectionReason}</span>
      </h3>
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
            className="w-full px-4 py-2 bg-gray-500 border-gray-300 rounded-md shadow-sm"
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
            className="w-full px-4 py-2 bg-gray-500 border-gray-300 rounded-md shadow-sm"
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
            className="w-full px-4 py-2 bg-gray-500 border-gray-300 rounded-md shadow-sm"
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
            className="w-full px-4 py-2 bg-gray-500 border-gray-300 rounded-md shadow-sm"
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
            className="w-full px-4 py-2 bg-gray-500 border-gray-300 rounded-md shadow-sm"
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
          {formData.idImage && (
            <p className="mt-2">
              Current: <a href={formData.idImage} target="_blank" className="text-blue-400 underline">View File</a>
            </p>
          )}
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
          {formData.taxCertificate && (
            <p className="mt-2">
              Current: <a href={formData.taxCertificate} target="_blank" className="text-blue-400 underline">View File</a>
            </p>
          )}
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
          {formData.businessLicense && (
            <p className="mt-2">
              Current: <a href={formData.businessLicense} target="_blank" className="text-blue-400 underline">View File</a>
            </p>
          )}
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

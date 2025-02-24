import React, { useEffect, useState } from 'react'
import upload from '../assets/upload_area.png'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const FullRegistration = () => {
    const navigate = useNavigate()
    const { user, fetchUser } = useAuth()

    useEffect(()=>{
        if(user.isFullyRegistered){
            toast.warning("you are already fully registered")
            fetchUser()
            navigate("/profile")
        }
    })

    const [form, setForm] = useState({ phone: "", address: "" });
    const [files, setFiles] = useState({});

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleFileChange = (e) => setFiles({ ...files, [e.target.name]: e.target.files[0] });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        const id = user._id
        formData.append("idImage", files.idImage);
        formData.append("taxCertificate", files.taxCertificate);
        formData.append("businessLicense", files.businessLicense);
        formData.append("tin", form.tin);
        formData.append("phone", form.phone);
        formData.append("address", form.address);

        try {
            const response = await axios.post(`/api/users/complete-registration/${id}`, formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            if (response.status === 200) {
                toast.success("registration successfull!!")
                navigate("/profile");
            }
        } catch (error) {
            toast.error(error)
            console.error(error);
        }
    }

    return (
        <div className="max-w-2xl md:mx-auto p-6 bg-gray-800 text-white shadow-md rounded-lg mx-2 mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-center">Complete your registration</h2>

            <form onSubmit={handleSubmit} className="space-y-4">


                {/* Name Field */}
                <div>
                    <label className="block text-gray-400">Enter Your TIN Number</label>
                    <input
                        type="text"
                        name="tin"
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-400">Enter Your Phone Number</label>
                    <input
                        type="text"
                        name="phone"
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Description Field */}
                <div>
                    <label className="block text-gray-400">Enter Your Location Address</label>
                    <textarea
                        name="address"
                        onChange={handleChange}
                        className="w-full px-4 pt-2 bg-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    ></textarea>
                </div>
                {/* Image Upload for id Field */}
                <div className=''>
                    <div >
                        <p className="pt- text-gray-500">ID Image</p>
                        <input name="idImage" onChange={handleFileChange} type="file" required 
                        className='cursor-pointer w-full border-gray-500 rounded-md shadow-sm' />
                    </div>

                    {/* Image Upload for tax clearace certeficate Field */}
                    <div >
                        <p className="pt-3 text-gray-500">Tax clearace certeficate Image</p>
                        <input name="taxCertificate" onChange={handleFileChange} type="file" required />
                    </div>

                    {/* Image Upload for Business licence certeficate Field */}
                    <div >
                        <p className="pt-3 text-gray-500">Business licence certeficate Image</p>
                        <input name="businessLicense" onChange={handleFileChange} type="file" required />
                    </div>
                </div>
                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300"
                >
                    Complete Registeration
                </button>
            </form>
        </div>
    )
}

export default FullRegistration
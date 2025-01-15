import React from 'react'
import { FaFacebook, FaLinkedin, FaTwitter } from 'react-icons/fa'

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-10 mt-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    <div className='md:col-span-2'>
                        <h1 className='text-orange-500 text-3xl font-bold'>Online Bidding System</h1>
                        <p className='text-gray-400 py-3'>Welcome to our online bidding platform where you can discover unique items and engage in exciting auctions from the comfort of your home.</p>
                        <div className="flex gap-2 py-2">
                            <FaFacebook/>
                            <FaTwitter/>
                            <FaLinkedin/>
                        </div>
                    </div>


                    <div>
                        <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
                        <ul className="text-sm text-gray-400">
                            <li className="mb-2"><a href="#" className="hover:underline">Home</a></li>
                            <li className="mb-2"><a href="#" className="hover:underline">Services</a></li>
                            <li className="mb-2"><a href="#" className="hover:underline">Contact</a></li>
                            <li className="mb-2"><a href="#" className="hover:underline">Blog</a></li>
                        </ul>
                    </div>

                    {/* Column 3 */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Contact Us</h2>
                        <ul className="text-sm text-gray-400">
                            <li className="mb-2">Email: info@example.com</li>
                            <li className="mb-2">Phone: +123-456-7890</li>
                            <li className="mb-2">Address: 123 Main St, City, Country</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
                    © 2024 Your Company. All rights reserved.
                </div>
            </div>
        </footer>

    )
}

export default Footer
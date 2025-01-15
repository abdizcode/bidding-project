import React, { useState } from 'react';
import { FaHome, FaUsers, FaGavel, FaAngleDoubleLeft, FaAngleDoubleRight, FaClipboardCheck, FaBell, FaSignOutAlt } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [activeSection, setActiveSection] = useState('Home');
    
    return (
        <div className={`flex md:flex-col md:min-h-screen p-4  bg-cyan-950 text-white transition-all duration-300 ${isExpanded ? 'md:w-60 w-full' : 'w-'}`}>
            {/* Header */}

            <div className="flex items-center justify-between mb-6">
                <p className={`ml- ${isExpanded ? 'block font-bold' : 'hidden'}`}>
                    Admin Dashboard
                </p>

                <button onClick={() => setIsExpanded(!isExpanded)} className="focus:outline-none">
                    {isExpanded ? <FaAngleDoubleLeft className="h-6 w-6" /> : <FaAngleDoubleRight className="h-6 w-6" />}
                </button>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1">
                <ul className='flex md:flex-col'>
                    <li className="py-2 hover:bg-gray-700 rounded-md cursor-pointer mb-5">
                        <Link
                            className="flex items-center"
                            to="/logout"
                        ><FaSignOutAlt className="h-6 w-6" />
                            <span
                                className={`ml-4 ${isExpanded ? 'block' : 'hidden'} }`}
                            >Logout</span>
                        </Link>
                    </li>
                    <hr />
                    <li className=" p-2 hover:bg-gray-700 rounded-md cursor-pointer">
                        <Link to="/admin" className='flex items-center' onClick={() => setActiveSection('Home')}><FaHome className="h-6 w-6" />
                            <span
                                className={`ml-4 ${isExpanded ? 'block' : 'hidden'} ${activeSection === 'Home' ? 'text-red-500' : ''}`}
                            >Home</span></Link>
                    </li>
                    <li className="p-2 hover:bg-gray-700 rounded-md cursor-pointer">
                        <Link to="/admin/users" className='flex items-center' onClick={() => setActiveSection('User')}><FaUsers className="h-6 w-6" />
                            <span className={`ml-4 ${isExpanded ? 'block' : 'hidden'} ${activeSection === 'User' ? 'text-red-500' : ''}`}
                            >Users</span></Link>
                    </li>
                    <li className="p-2 hover:bg-gray-700 rounded-md cursor-pointer">
                        <Link to="/admin/auction" className='flex items-center' onClick={() => setActiveSection('Auction')}><FaGavel className="h-6 w-6" />
                            <span className={`ml-4 ${isExpanded ? 'block' : 'hidden'} ${activeSection === 'Auction' ? 'text-red-500' : ''}`}
                            >Auctions</span></Link>
                    </li>
                    <li className="p-2 hover:bg-gray-700 rounded-md cursor-pointer">
                        <Link to="/notification" className='flex items-center ' onClick={() => setActiveSection('Notification')}><FaBell className="h-6 w-6" />
                            <span className={`ml-4 ${isExpanded ? 'block' : 'hidden'} ${activeSection === 'Notification' ? 'text-red-500' : ''}`}
                            >Notifications</span></Link>
                    </li>
                    <li className="p-2 hover:bg-gray-700 rounded-md cursor-pointer">
                        <Link to="/compliant" className='flex items-center' onClick={() => setActiveSection('Compliant')}><FaClipboardCheck className="h-6 w-6" />
                            <span className={`ml-4 ${isExpanded ? 'block ' : 'hidden'} ${activeSection === 'Compliant' ? 'text-red-500' : ''}`}
                            >Compliants</span></Link>
                    </li>

                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;

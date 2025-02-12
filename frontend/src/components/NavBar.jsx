import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { GrList } from "react-icons/gr";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FaBell, FaPlusCircle } from "react-icons/fa";
import { toast } from "react-toastify";

const NavBar = () => {
	const { user } = useAuth();
	const [isOpen, setIsOpen] = useState(false);
	const [isOpen1, setIsOpen1] = useState(false);

	const navigate = useNavigate();
	const [selectedOption, setSelectedOption] = useState("");


	const toggleDropdown = () => {
		setIsOpen1(!isOpen1);
	};

	const handleChange = (event) => {
		const value = event.target.value;
		setSelectedOption(value);
		if (value) {
			navigate(value); // Navigate to the selected route
		}
	};

	const handleCreate = () => {
		if (user.isFullyRegistered) {
			if (user.approvalStatus === "approved") {
				navigate("/auction/create")
			} else if (user.approvalStatus === "rejected") {
				toast.warning("you are rejected Update your profile")
				navigate("/profile")
			} else if (user.approvalStatus === "pending") {
				toast.warning("You are not approved yet!")
			}

		} else {
			toast.error('You have to register first!');
			navigate(`/fullRegistration`)
		}
	}
	return (
		<nav className="bg-gray-900 bg-opacity-70 backdrop-blur-md p-3 shadow-lg w-full px-10">
			<div className="contain mx-auto flex items-center  justify-between">
				<Link className="text-xl font-bold text-yellow-500 " to={user?.role === 'Admin' ? "/admin" : "/profile"}>
					{user?.role === 'Admin' ? "Admin" : "Online Bidding System"}
				</Link>
				<div>
					<button
						className="lg:hidden  text-white focus:outline-none"
						onClick={() => setIsOpen(!isOpen)}
					>
						<GrList size={30} />
					</button>
					<div className={`w-full lg:flex lg:items-center lg:w-auto hidden ${isOpen ? "block" : "hidden"}`} >
						<ul className="flex flex-col lg:flex-row lg:space-x-6 space-y-4 lg:space-y-0 mt-4 lg:mt-0">

							{/* if user is admin or not for the middle part */}

							{user?.role === 'Admin'
								? <div className="lg:mr-36 sm:mr-0 flex lg:flex-row flex-col gap-2 lg:gap-10">
									<li>
										<Link
											className="text-white hover:text-gray-300"
											to="/admin/auction"
										>
											Auctions
										</Link>
									</li>
									<li>
										<Link
											className="text-white hover:text-gray-300"
											to="/admin/users"
										>
											Users
										</Link>
									</li>
									<li>
										<Link
											className="text-white hover:text-gray-300"
											to="/admin/complaints"
										>
											Complaints
										</Link>
									</li>
									<li>
										<Link
											className="text-white hover:text-gray-300"
											to="/admin/notification"
										>
											Notification
										</Link>
									</li>
								</div>
								: <div className="lg:mr-36 sm:mr-0 flex lg:flex-row flex-col gap-2 lg:gap-10 items-center">
									<li>
										<Link
											className="text-white hover:text-gray-300 text-"
											to="/"
										>
											Home
										</Link>
									</li>
									<li>
										<Link
											className="text-white hover:text-gray-300 text-"
											to="/auctions"
										>
											Auctions
										</Link>
									</li>
									<li>
										<Link
											className="text-white hover:text-gray-300 text-"
											to="/about"
										>
											About us
										</Link>
									</li>
								</div>}

							{/* the 3 part  */}
							{!user && (
								<div className="flex gap-2 lg:gap-3 lg:flex-row flex-col">
									<li>
										<Link
											className="text-white hover:text-gray-300 border rounded-lg px-2 border-purple-400"
											to="/login"
										>
											Login
										</Link>
									</li>
									<li>
										<Link
											className="text-white hover:text-gray-300 border rounded-lg px-2 border-purple-400"
											to="/signup"
										>
											Signup
										</Link>
									</li>
								</div>
							)}
							{user && (
								<div className="flex gap-3 lg:flex-row flex-col items-center">
									<li>
										<div
											className={`${user?.role === 'Admin' ? "text-white hover:text-gray-300 border px-2 rounded-lg border-purple-400" : ''} `}
										// to={user?.role === 'Admin' ? "/admin" : "/Profile"}
										>
											{user?.role === 'Admin' ?
												<Link to="/admin" >Dashboard</Link>
												: <div className="relative inline-block">
													{/* Dropdown Button */}
													<Link onClick={toggleDropdown} className="text-white hover:text-gray-300 border px-1 rounded-lg border-purple-400 flex items-center"
													>
														Profile Options <RiArrowDropDownLine size={20} />
													</Link>

													{/* Dropdown Menu */}
													{isOpen1 && (
														<div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
															<ul className="py-2">
																<li onClick={toggleDropdown}>
																	<Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-500">
																		My Profile
																	</Link>
																</li>
																<li onClick={toggleDropdown}>
																	<Link to="/userAuction" className="block px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-500">
																		My Auctions
																	</Link>
																</li>
																<li onClick={toggleDropdown}>
																	<Link to="/bids" className="block px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-500">
																		My Bids
																	</Link>
																</li>
																<li onClick={toggleDropdown}>
																	<Link to="/userNotification" className="block px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-500">
																		My Notifications
																	</Link>
																</li>
																<li onClick={toggleDropdown}>
																	<Link to="/victory" className="block px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-500">
																		My Victories
																	</Link>
																</li>
															</ul>
														</div>
													)}
												</div>}

										</div>
									</li>
									<li>

										<Link

											to="/logout"
										>
											<button className="text-white hover:text-gray-300 border px-2 rounded-lg border-purple-400">Logout</button>
										</Link>
									</li>
									<li className="">
										<Link
											className="hover:text-gray-300 px-2 flex items-center justify-between"
											to={user.role==="Admin"?`/admin/notification`: "/userNotification"}
										>
											<FaBell color="white" size={20} />
										</Link>
									</li>
									{user.role != "Admin" && <li className="">
										<button
											className="hover:text-gray-300 flex items-center justify-between"
											onClick={handleCreate}
										>
											<FaPlusCircle color="white" size={20} />
										</button>
									</li>}
								</div>
							)}
						</ul>
					</div>
				</div>

			</div>

			{/* for mobile  */}
			<div className={`${isOpen ? "block" : "hidden"} text-whte grid lg:hidden`}>
				<ul className="flex flex-col lg:flex-row lg:space-x-6 space-y-4 lg:space-y-0 mt-4 lg:mt-0">
					{user?.role === 'Admin'
						? <div className="lg:mr-36 sm:mr-0 flex lg:flex-row flex-col gap-2 lg:gap-10">
							<li>
								<Link
									className="text-white hover:text-gray-300"
									to="/admin/auction"
								>
									Auctions
								</Link>
							</li>
							<li>
								<Link
									className="text-white hover:text-gray-300"
									to="/admin/users"
								>
									Users
								</Link>
							</li>
							<li>
								<Link
									className="text-white hover:text-gray-300"
									to="/admin/compliants"
								>
									Complaints
								</Link>
							</li>
							<li>
								<Link
									className="text-white hover:text-gray-300"
									to="/notification"
								>
									Notification
								</Link>
							</li>
						</div>
						: <div className="lg:mr-36 sm:mr-0 flex lg:flex-row flex-col gap-2 lg:gap-10">
							<li>
								<Link
									className="text-white hover:text-gray-300 text-"
									to="/"
								>
									Home
								</Link>
							</li>
							<li>
								<Link
									className="text-white hover:text-gray-300 text-"
									to="/auctions"
								>
									Auctions
								</Link>
							</li>
							<li>
								<Link
									className="text-white hover:text-gray-300 text-"
									to="/about"
								>
									About us
								</Link>
							</li>
						</div>}


					{!user && (
						<div className="flex gap-2 lg:gap-3 lg:flex-row flex-col">
							<li>
								<Link
									className="text-white hover:text-gray-300 border rounded-lg px-2 border-purple-400"
									to="/login"
								>
									Login
								</Link>
							</li>
							<li>
								<Link
									className="text-white hover:text-gray-300 border rounded-lg px-2 border-purple-400"
									to="/signup"
								>
									Signup
								</Link>
							</li>
						</div>
					)}
					{user && (
						<div className="flex gap-3 z-[1]  lg:flex-row flex-col">
							<li>
								<div
									className={`${user?.role === 'Admin' ? "text-white " : ''} `}
								// to={user?.role === 'Admin' ? "/admin" : "/Profile"}
								>
									{user?.role === 'Admin' ? <>
										<li>
											<Link
												className="text-white hover:text-gray-300 border py-1 px-2 rounded-lg border-purple-400"
												to="/admin"
											>
												Dashboard
											</Link>
										</li>
									</> : <div className="relative inline-block">
										{/* Dropdown Button */}
										<Link onClick={toggleDropdown} className="text-white hover:text-gray-300 border px-1 rounded-lg border-purple-400 flex items-center"
										>
											Profile Options <RiArrowDropDownLine size={20} />
										</Link>

										{/* Dropdown Menu */}
										{isOpen1 && (
											<div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200">
												<ul className="py-2">
													<li onClick={toggleDropdown}>
														<Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-500">
															My Profile
														</Link>
													</li>
													<li onClick={toggleDropdown}>
														<Link to="/userAuction" className="block px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-500">
															My Auctions
														</Link>
													</li>
													<li onClick={toggleDropdown}>
														<Link to="/bids" className="block px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-500">
															My Bids
														</Link>
													</li>
													<li onClick={toggleDropdown}>
														<Link to="/userNotification" className="block px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-500">
															My Notifications
														</Link>
													</li>
													<li onClick={toggleDropdown}>
														<Link to="/victory" className="block px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-500">
															My Victories
														</Link>
													</li>
												</ul>
											</div>
										)}
									</div>}

								</div>
							</li>
							<li>
								<Link
									className="text-white hover:text-gray-300 border px-2 rounded-lg border-purple-400"
									to="/logout"
								>
									Logout
								</Link>
							</li>
							<li className="">
								<button
									className="hover:text-gray-300 text-white border px-2 rounded-lg border-purple-400 "
									onClick={handleCreate}
								>
									<p className="flex flex-row items-center justify-between gap-2">Create Auction<FaPlusCircle color="white"/></p>
								</button>
							</li>
							<li className="">
								<Link
									className="hover:text-gray-300 flex items-center justify-between"
									to={user.role==="Admin"?`/admin/notification`: "/userNotification"}
								>
									<FaBell color="white" size={20} />
								</Link>
							</li>
							
						</div>
					)}
				</ul>
			</div>
		</nav>
	);
};

export default NavBar;

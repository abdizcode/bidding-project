import PropTypes from "prop-types";
import dawud from '../assets/dawud.png'
import emran from '../assets/emran.png'
import eyob from '../assets/eyob.jpg'
import mule from '../assets/mule.jpg'
import abdu from '../assets/p_about.png'
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRightLong, FaPerson } from "react-icons/fa6";
import herovector from "../assets/heroimg.png";
import { RiFindReplaceLine } from "react-icons/ri";
import { HiOutlineChevronDoubleRight, HiOutlineChevronDoubleDown } from "react-icons/hi";
import { MdOutlineAccountCircle, MdOutlineManageAccounts } from "react-icons/md"
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { CiStreamOn } from "react-icons/ci";

const Home = () => {
	const navigate = useNavigate()
	const { user } = useAuth()
	const [data, setData] = useState({
		activeAuctions: [],
		activeCount: 0,
	})

	useEffect(() => {
		const fetchCounts = async () => {
			try {
				const response = await axios.get("/api/users/count");

				setData({
					activeAuctions: response.data.activeAuctions,
					activeCount: response.data.activeAuctionsCount
				})

			} catch (error) {
				console.error("Error fetching user count:", error);
			}
		};

		fetchCounts();
	}, []);

	const clickCreate = () => {
		if (user.isFullyRegistered) {
			if (user.approvalStatus === "approved") {
				navigate("/auction/create")
			} else if (user.approvalStatus === "rejected") {
				toast.warning("you are rejected Update your profile")
				navigate("/profile")
			} else {
				toast.warning("You are not approved yet!")
			}

		} else {
			toast.error('You have to register first!');
			navigate(`/fullRegistration`)
		}
	}
	return (
		<div className="">
			<section>
				<div className=" lg:h-screen py-20 p-5 lg:px-12 flex items-center justify-center flex-wrap lg:flex-nowrap gap-5 text-white">
					<div className="w-full flex flex-col gap-4 z-[1] relative ">
						<h3 className="tracking-wider">DISCOVER, COLLECT AND SELL</h3>
						<h1 className="text-5xl font-bold">
							Discover Rare Products And Bid in Real-Time
						</h1>
						<p>
							Our real-time auctions let you join the thrill of selling, hunting
							and bidding live on rare Products. Explore our listings to start
							bidding or sell your own products!
						</p>
						<div className="flex gap-4">
							<Link
								className="hover:scale-105 flex border border-border-info-color px-5 py-3 mt-2 rounded-xl text-white cursor-pointer font-bold tracking-wide hover:bg-hover transition-all duration-200  w-fit"
								to="/about"
							>
								<div className="flex items-center gap-2">
									<RiFindReplaceLine />
									<span>Explore More </span>
								</div>
							</Link>
							<button
								className="hover:scale-105 flex border bg-theme-color px-5 py-3 mt-2 rounded-xl text-white cursor-pointer font-bold tracking-wide hover:bg-hover transition-all duration-200  w-fit"
								onClick={clickCreate}
							>
								<div className="flex items-center gap-2">
									<span>Create Now </span>
									<FaArrowRightLong />
								</div>
							</button>
						</div>
					</div>
					<div className="w-full lg:p-20 animate-float ">
						<img src={herovector} alt="Hero-img" />
					</div>
				</div>
			</section>

			<section>
				<div className="mt-8 min-h-96 bg-cyan-900 p-4">
					<h3 className=" text-white mb-4 text-4xl font-bold">Active Auctions</h3>
					{!data.activeCount == 0 ?
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
						<p className='text-white flex items-center gap-3'><CiStreamOn size={20}/>There is no active auction right now...</p>}

				</div>
			</section>

			<section className="bg-blue-100">
				<div className="px-auto w-fit m-auto">
					<h2 className="text-center text-whit font-bold py-14 text-xl">Steps to participate on Auction</h2>
					<div className=' lg:flex items-center pb-10'>
						<div className="rounded-full border-gray-400 m-4 p-2 w-64 h-64 border-4">
							<div className="rounded-full border-8 border-gray-500 border-3 w-full h-full flex flex-col items-center justify-center ">
								<MdOutlineAccountCircle size={42} color="cyne" />
								<h2 className="font-bold text-lg">Sing Up</h2>
								<p className="font-bold">create your account</p>
							</div>
						</div>
						<HiOutlineChevronDoubleRight size={42} color="blue" className="lg:block hidden " />
						<HiOutlineChevronDoubleDown size={42} color="blue" className="lg:hidden block mx-auto" />
						<div className="rounded-full border-4 border-blue-400 m-4 p-2 w-64 h-64">
							<div className="rounded-full border-8 border-blue-500 w-full h-full flex flex-col items-center justify-center ">
								<MdOutlineManageAccounts size={42} color="blue" />
								<h2 className="font-bold text-lg">Registration</h2>
								<p className="font-bold">Register with full info</p>
							</div>
						</div>
						<HiOutlineChevronDoubleRight size={42} color="green" className="lg:block hidden " />
						<HiOutlineChevronDoubleDown size={42} color="green" className="lg:hidden block mx-auto" />
						<div className="rounded-full border-4 border-green-600 m-4 p-2 w-64 h-64">
							<div className="rounded-full border-8 border-green-700 w-full h-full flex flex-col items-center justify-center ">
								<FaPerson size={42} color="green" />
								<h2 className="font-bold text-lg">Get Approved</h2>
								<p className="font-bold">Great! you are approved</p>
							</div>
						</div>
					</div>
				</div>

			</section>

			<section>
				<div id='about'>
					<div className="text-white py-24 sm:py-32">
						<div className="mx-auto grid max-w-7xl gap-x-8 gap-y-20 px-6 lg:px-8 xl:grid-cols-3">
							<div className="max-w-2xl md:mr-3">
								<h2 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">Meet our team</h2>
								<p className="mt-6 text-lg leading-8 text-gray-200">We are Debretabor university computer science students</p>
								<h4 className="text-xl font-semibold my-2">Our Mission</h4>
								<p className="text-gray-200 ">Our mission is to provide a seamless and enjoyable bidding experience for our users while connecting
									them with a diverse range of products. Simply browse through our curated selection of items,
									place your bids, and watch the excitement unfold as you compete with others to win your desired
									items.
								</p>
							</div>
							<ul role="list" className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2">
								<li>
									<div className="flex items-center gap-x-6">
										<img className="h-16 w-16 rounded-full" src={abdu} alt="" />
										<div>
											<h3 className="text-base font-semibold leading-7 tracking-tight text-gray-300">Abdulsomed Jibril</h3>
											<p className="text-sm font-semibold leading-6 text-indigo-600">Mern stack developer</p>
										</div>
									</div>
								</li>
								<li>
									<div className="flex items-center gap-x-6">
										<img className="h-16 w-16 rounded-full" src={eyob} alt="" />
										<div>
											<h3 className="text-base font-semibold leading-7 tracking-tight text-gray-300">Eyob abebe</h3>
											<p className="text-sm font-semibold leading-6 text-indigo-600">Mern stack developer</p>
										</div>
									</div>
								</li>
								<li>
									<div className="flex items-center gap-x-6">
										<img className="h-16 w-16 rounded-full" src={mule} alt="" />
										<div>
											<h3 className="text-base font-semibold leading-7 tracking-tight text-gray-300">Muluken Dagne</h3>
											<p className="text-sm font-semibold leading-6 text-indigo-600">Mern stack developer</p>
										</div>
									</div>
								</li>
								<li>
									<div className="flex items-center gap-x-6">
										<img className="h-16 w-16 rounded-full" src={dawud} alt="" />
										<div>
											<h3 className="text-base font-semibold leading-7 tracking-tight text-gray-300">Dawud workuv</h3>
											<p className="text-sm font-semibold leading-6 text-indigo-600">Mern stack developer</p>
										</div>
									</div>
								</li>
								<li>
									<div className="flex items-center gap-x-6">
										<img className="h-16 w-16 rounded-full" src={emran} alt="" />
										<div>
											<h3 className="text-base font-semibold leading-7 tracking-tight text-gray-300">Emran Ahmed,</h3>
											<p className="text-sm font-semibold leading-6 text-indigo-600">Mern stack developer</p>
										</div>
									</div>
								</li>
								<li>
									<div className="flex items-center gap-x-6">
										<img className="h-16 w-16 rounded-full" src={abdu} alt="" />
										<div>
											<h3 className="text-base font-semibold leading-7 tracking-tight text-gray-300">Henok Gebresslassie</h3>
											<p className="text-sm font-semibold leading-6 text-indigo-600">Mern stack developer</p>
										</div>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</section>

			<section>
				<div>

				</div>
			</section>
		</div>
	);
};

export default Home;

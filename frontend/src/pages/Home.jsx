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
import io from 'socket.io-client';
const socket = io('http://localhost:5000');

const Home = () => {
	const navigate = useNavigate()
	const { user } = useAuth()

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
				<div className=" lg:h-screen py-20 p-5 lg:px-12 flex items-center justify-center flex-wrap lg:flex-nowrap gap-5 text-whit">
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
								className="hover:scale-105 flex border border-gray-600 px-5 py-3 mt-2 rounded-xl cursor-pointer font-bold tracking-wide hover:bg-hover transition-all duration-200  w-fit"
								to="/about"
							>
								<div className="flex items-center gap-2">
									<RiFindReplaceLine />
									<span>Explore More </span>
								</div>
							</Link>
							<button
								className="hover:scale-105 flex border border-gray-600 bg-theme-color px-5 py-3 mt-2 rounded-xl cursor-pointer font-bold tracking-wide hover:bg-hover transition-all duration-200  w-fit"
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
					<div className="py-24 sm:py-32">
						<div className="mx-auto grid max-w-7xl gap-x-8 gap-y-20 px-6 lg:px-8 xl:grid-cols-3">
							<div className="max-w-2xl md:mr-3">
								<h2 className="text-3xl font-bold tracking-tight text-gray-700 sm:text-4xl">Meet our team</h2>
								<p className="mt-6 text-lg leading-8 text-gray-700">We are Debretabor university computer science students</p>
								<h4 className="text-xl font-semibold my-2">Our Mission</h4>
								<p className="text-gray-700 ">Our mission is to provide a seamless and enjoyable bidding experience for our users while connecting
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
											<h3 className="text-base font-semibold leading-7 tracking-tight text-gray-800">Abdulsomed Jibril</h3>
											<p className="text-sm font-semibold leading-6 text-indigo-600">Mern stack developer</p>
										</div>
									</div>
								</li>
								<li>
									<div className="flex items-center gap-x-6">
										<img className="h-16 w-16 rounded-full" src={eyob} alt="" />
										<div>
											<h3 className="text-base font-semibold leading-7 tracking-tight text-gray-800">Eyob abebe</h3>
											<p className="text-sm font-semibold leading-6 text-indigo-600">Mern stack developer</p>
										</div>
									</div>
								</li>
								<li>
									<div className="flex items-center gap-x-6">
										<img className="h-16 w-16 rounded-full" src={mule} alt="" />
										<div>
											<h3 className="text-base font-semibold leading-7 tracking-tight text-gray-800">Muluken Dagne</h3>
											<p className="text-sm font-semibold leading-6 text-indigo-600">Mern stack developer</p>
										</div>
									</div>
								</li>
								<li>
									<div className="flex items-center gap-x-6">
										<img className="h-16 w-16 rounded-full" src={dawud} alt="" />
										<div>
											<h3 className="text-base font-semibold leading-7 tracking-tight text-gray-800">Dawud workuv</h3>
											<p className="text-sm font-semibold leading-6 text-indigo-600">Mern stack developer</p>
										</div>
									</div>
								</li>
								<li>
									<div className="flex items-center gap-x-6">
										<img className="h-16 w-16 rounded-full" src={emran} alt="" />
										<div>
											<h3 className="text-base font-semibold leading-7 tracking-tight text-gray-800">Emran Ahmed,</h3>
											<p className="text-sm font-semibold leading-6 text-indigo-600">Mern stack developer</p>
										</div>
									</div>
								</li>
								<li>
									<div className="flex items-center gap-x-6">
										<img className="h-16 w-16 rounded-full" src={abdu} alt="" />
										<div>
											<h3 className="text-base font-semibold leading-7 tracking-tight text-gray-800">Henok Gebresslassie</h3>
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

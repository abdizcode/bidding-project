import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import upload from '../assets/upload_area.png'
import { toast } from "react-toastify";


const CreateAuctionItem = () => {
	const [image, setImage] = useState(false);
	const [data, setData] = useState({
		title: "",
		address: "",
		description: "",
		startingBid: "",
		endDate: ""
	});

	const [error, setError] = useState("");
	const navigate = useNavigate();

	const onChangeHandler = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		setData({ ...data, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("title", data.title);
		formData.append("address", data.address);
		formData.append("description", data.description);
		formData.append("endDate", data.endDate);
		formData.append("startingBid", Number(data.startingBid));
		formData.append("image", image);

		const token = document.cookie
			.split("; ")
			.find((row) => row.startsWith("jwt="))
			?.split("=")[1];
		if (token) {
			try {
				await axios.post(
					"/api/auctions", formData,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setData({
					title: "",
					address:"",
					description: "",
					startingBid: "",
					endDate: ""
				})
				setImage(false)
				toast.success("Auction created successfuly!!")
				navigate("/profile");
			} catch (err) {
				setError("Failed to create auction. Please try again.");
				console.error(err);
			}
		}
	};

	return (
		<div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 text-gray-300">
			<div className="max-w-4xl mx-auto">
				<div className="bg-gray-800 bg-opacity-50 shadow-xl rounded-lg overflow-hidden">
					<div className="p-6 sm:p-10">
						<h2 className="text-3xl text-center font-extrabold text-white mb-8">
							Create Auction
						</h2>

						{error && <p className="text-red-500 mb-4">{error}</p>}
						<form onSubmit={handleSubmit}>
							{/* Image Upload for id Field */}
							<div className="lg:flex justify-b gap-10">
								<div className="md:w-1/2">
									<div >
										<p className="pb-2">Upload your auction item Image</p>
										<label htmlFor="image">
											<img src={image ? URL.createObjectURL(image) : upload} alt="" className='w-52' />
										</label>
										<input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' hidden required />
									</div>

									<div className="mt-4">
										<label
											htmlFor="title"
											className="block text-lg font-medium text-gray-300 mb-1"
										>
											Title
										</label>
										<input
											id="title"
											type="text"
											name="title"
											value={data.title}
											onChange={onChangeHandler}
											className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-300"
											required
										/>
									</div>
									<div className="mt-4">
										<label
											htmlFor="title"
											className="block text-lg font-medium text-gray-300 mb-1"
										>
											Address
										</label>
										<input
											id="address"
											type="text"
											name="address"
											value={data.address}
											onChange={onChangeHandler}
											className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-300"
											required
										/>
									</div>
								</div>
								<div className="md:w-1/2">
									<div className="mb-4">
										<label
											htmlFor="description"
											className="block text-lg font-medium text-gray-300 mb-1"
										>
											Description
										</label>
										<textarea
											id="description"
											name="description"
											rows="4"
											value={data.description}
											onChange={onChangeHandler}
											className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-300"
											required
										/>
									</div>
									<div className="mb-4">
										<label
											htmlFor="startingBid"
											className="block text-lg font-medium text-gray-300 mb-1"
										>
											Starting Bid(birr)
										</label>
										<input
											id="startingBid"
											type="number"
											name="startingBid"
											value={data.startingBid}
											onChange={onChangeHandler}
											className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-300"
											min={0}
											required
										/>
									</div>
									<div className="mb-4">
										<label
											htmlFor="endDate"
											className="block text-lg font-medium text-gray-300 mb-1"
										>
											End Date
										</label>
										<input
											id="endDate"
											type="datetime-local"
											name="endDate"
											value={data.endDate}
											onChange={onChangeHandler}
											className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-300"
											required
										/>
									</div>
								</div>
							</div>


							<button
								type="submit"
								className="w-full mt-5 inline-block bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition-colors duration-300 text-lg font-semibold"
							>
								Create Auction
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CreateAuctionItem;

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useAuth } from "../context/AuthContext";

function Signup() {
	const { isLoggedIn } = useAuth()
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		if (isLoggedIn) {
			navigate("/profile");
		}
	}, [isLoggedIn, navigate]);

	const handleSignup = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const res = await axios.post(
				"/api/users/register",
				{ username, email, password, confirmPassword },
				{ withCredentials: true }
			);
			if (res.status === 201) {
				navigate("/login");
			}
		} catch (err) {
			setError(err.response?.data?.message || "An error occurred");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-cover bg-center">
			<div className="w-full max-w-md p-8 bg-gray-800 bg-opacity-50 rounded-lg shadow-lg">
				<h2 className="mb-6 text-3xl font-semibold text-white text-center">
					Signup
				</h2>
				<form onSubmit={handleSignup} className="space-y-4">
					<div className="flex items-center border rounded-md border-gray-600 bg-gray-700">
						<FiUser className="w-6 h-6 text-gray-400 ml-3" />
						<input
							type="text"
							className="w-full px-4 py-2 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
							placeholder="Username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
						/>
					</div>
					<div className="flex items-center border rounded-md border-gray-600 bg-gray-700">
						<FiMail className="w-6 h-6 text-gray-400 ml-3" />
						<input
							type="email"
							className="w-full px-4 py-2 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div className="flex items-center border rounded-md border-gray-600 bg-gray-700">
						<FiLock className="w-6 h-6 text-gray-400 ml-3" />
						<input
							type="password"
							className="w-full px-4 py-2 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					<div className="flex items-center border rounded-md border-gray-600 bg-gray-700">
						<FiLock className="w-6 h-6 text-gray-400 ml-3" />
						<input
							type="password"
							className="w-full px-4 py-2 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
							placeholder="Confirm Password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
						/>
					</div>
					<div className="flex gap-2 items-start text-white">
						<input type="checkbox" required className="mt-1"/>
						<p className="text-sm">By continuing, I agree to the terms of use and privacy policy</p>
					</div>
					<div className="flex items-center justify-between mt-4">
						<p className="text-white">

							Already have an account?{" "}
							<Link
								to="/login"
								className="text-indigo-300 hover:underline"
							>
								Login
							</Link>
						</p>
						<button
							type="submit"
							className="px-6 py-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
							disabled={loading}
						>
							{loading ? (
								<AiOutlineLoading3Quarters className="w-6 h-6 animate-spin mx-auto" />
							) : (
								"Signup"
							)}
						</button>
					</div>
					
				</form>
				{error && (
					<div className="mt-4 text-red-300 text-center">{error}</div>
				)}
			</div>
		</div>
	);
}

export default Signup;

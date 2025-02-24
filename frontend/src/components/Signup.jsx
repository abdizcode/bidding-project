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

	const checkPasswordStrength = (password) => {
		let strength = 0;
		if (password.length >= 8) strength += 1;
		if (/[A-Z]/.test(password)) strength += 1;
		if (/[a-z]/.test(password)) strength += 1;
		if (/[0-9]/.test(password)) strength += 1;
		if (/[^A-Za-z0-9]/.test(password)) strength += 1;
		return strength;
	};

	const getPasswordStrengthMessage = (strength) => {
		switch (strength) {
			case 0:
			case 1:
				return "Very Weak";
			case 2:
				return "Weak";
			case 3:
				return "Moderate";
			case 4:
				return "Strong";
			case 5:
				return "Very Strong";
			default:
				return "";
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen mx-3">
			<div className="w-full max-w-md p-8 bg-gray-800 bg-opacity-50 rounded-lg shadow-lg mb-28">
				<h2 className="mb-6 text-3xl font-semibold text-white text-center">
					Signup
				</h2>
				<form onSubmit={handleSignup} className="space-y-4">
					<div className="relative bg-gray-700 rounded-lg">
						<FiUser className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
						<input
							type="text"
							className="w-full text-gray-200 bg-gray-700 pl-12 p-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
						/>
					</div>
					<div className="relative bg-gray-700 rounded-lg">
						<FiMail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
						<input
							type="email"
							className="w-full text-gray-200 bg-gray-700 pl-12 p-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div className="relative bg-gray-700 rounded-lg">
						<FiLock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
						<input
							type="password"
							className="w-full text-gray-200 bg-gray-700 pl-12 p-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
						<div className="text-sm text-gray-400 mt-1">
							{getPasswordStrengthMessage(checkPasswordStrength(password))}
						</div>
					</div>
					<div className="relative bg-gray-700 rounded-lg">
						<FiLock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
						<input
							type="password"
							className="w-full text-gray-200 bg-gray-700 pl-12 p-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Confirm Password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
						/>
					</div>
					<div className="flex gap-2 items-start text-white">
						<input type="checkbox" required className="mt-1"/>
						<p className="text-sm">
							By continuing, I agree to the {" "}
							<Link to="/privacypolicy" className="text-indigo-800 hover:underline">terms of use and privacy policy</Link></p>
					</div>
					<div className="flex items-center justify-between mt-4">
						<p className="text-white">
							Already have an account?{" "}
							<Link
								to="/login"
								className="text-indigo-700 hover:underline"
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

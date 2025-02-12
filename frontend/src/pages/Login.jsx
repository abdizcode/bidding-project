import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useAuth } from "../context/AuthContext";
import { FaUser } from "react-icons/fa";

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const { user, login } = useAuth();

	useEffect(() => {
		if (user) {
			if (user.role === "User") {
				console.log(user.role)
				navigate("/profile");
			} else if (user.role === "Admin") {
				navigate("/admin");
			}
		}
	}, [user]);

	const handleLogin = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const res = await axios.post(
				"/api/users/login",
				{ email, password },
				{ withCredentials: true }
			);
			if (res.status === 200) {
				const user = res.data.user
				console.log("login successful")

				login(user)
				if (user.role === "Admin") {
					navigate("/admin")
				} else if (user.role === "User") {
					navigate("/profile")
				}
			}
		} catch (err) {
			setError(err.response?.data?.message || "An error occurred");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-cover bg-center ">
			<div className="w-full max-w-md p-8 bg-gray-800 bg-opacity-50 rounded-lg shadow-lg mb-36">
				<h2 className="mb-6 text-3xl font-semibold text-white text-center">
					Login
				</h2>
				<form onSubmit={handleLogin} className="space-y-4">
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
					</div>
					<div className="flex items-center justify-between mt-4">
						<p className="text-white">
							Don{"'"}t have an account?{" "}
							<Link
								to="/signup"
								className="text-indigo-700 hover:underline"
							>
								Signup
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
								"Login"
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

export default Login;

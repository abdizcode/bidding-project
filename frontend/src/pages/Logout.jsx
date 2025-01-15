import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function Logout() {
	const navigate = useNavigate();
	const { logout: signout } = useAuth();

	useEffect(() => {
		const logout = async () => {
			try {
				await axios.post("/api/users/logout", {});
				document.cookie =
					"jwt=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
				signout();
				navigate("/login");
			} catch (err) {
				console.error(err);
			}
		};

		logout();
	}, [navigate]);

	return <div>Logging out...</div>;
}

export default Logout;

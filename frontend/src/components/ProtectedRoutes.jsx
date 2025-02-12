import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRole }) => {
	const location = useLocation();
	const { user } = useAuth();

	const token = document.cookie
		.split("; ")
		.find((row) => row.startsWith("jwt="))
		?.split("=")[1];

	return (
		!token
			? <Navigate to="/login" state={{ from: location }} replace />
			: (allowedRole.includes(user?.role))
				? <Outlet />
				: <Navigate to="/unauthorized" state={{ from: location }} replace />

	)

};

export default ProtectedRoute;

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext({
    login: () => {},
    logout: () => {},
    user: null,
    fetchUser: () => {}, // Add fetchUser to the context
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = (user) => {
        setUser(user);
        setLoading(false);
    };

    const logout = () => {
        setUser(null);
    };

    const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("jwt="))
        ?.split("=")[1];

    const fetchUser = async () => {
        if (token) {
            setLoading(true);
            try {
                const { data } = await axios.post('/api/users/refresh', {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("refresh success", data.user.role);
                login(data.user);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    if (loading && token) {
        return (
            <div className="flex items-center justify-center h-screen bg-cyan-50">
                <div className="w-32 h-32 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};
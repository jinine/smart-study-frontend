import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

interface User {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    profile_picture_url?: string;
    is_active: boolean;
    created_at: string;
}

const Profile = () => {
    const [user, setUser] = useState<User | null>(null);
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const isLoggedIn = !!localStorage.getItem("token");
    const navigate = useNavigate();
    const user_token = localStorage.getItem("user");
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/");
        }
    }, [isLoggedIn, navigate]);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.post(`${process.env.REACT_APP_BACKEND_URI}/api/v1/user/get_user`, {
                    email: user_token,
                });
                setUser(response.data);
            } catch (err) {
                setError("Failed to load user data.");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleUpdatePassword = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URI}/api/v1/user/update_password`, {
                username: user?.username,
                password: newPassword,
            });
            alert("Password updated successfully");
            setNewPassword("");
        } catch (err) {
            alert("Failed to update password");
        }
    };

    if (loading) return <p className="text-white text-center mt-10">Loading...</p>;
    if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

    return (
        <>
        <Header />
            <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center py-10 px-4">
                <div className="bg-gray-900 shadow-2xl rounded-xl p-8 max-w-lg w-full text-center border border-gray-800">
                    {user?.profile_picture_url && (
                        <img
                            src={user.profile_picture_url}
                            alt="Profile"
                            className="w-28 h-28 rounded-full mx-auto border-4 border-blue-500 shadow-lg"
                        />
                    )}
                    <h2 className="text-3xl font-bold mt-4">{user?.first_name} {user?.last_name}</h2>
                    <p className="text-gray-400 text-lg">@{user?.username}</p>
                    <p className="text-gray-500 text-sm">{user?.email}</p>

                    <div className="mt-6">
                        <input
                            type="password"
                            className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button
                            onClick={handleUpdatePassword}
                            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 transition-all py-3 rounded-lg text-white font-semibold shadow-md"
                        >
                            Update Password
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Profile;
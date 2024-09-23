import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { socket } from "./Home";

interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  bio: string;
}

const token = sessionStorage.getItem('token') || '';
const userId = sessionStorage.getItem('currentUserId') || '';

async function getUserProfile() {
  const base_url = `http://localhost:3000/users/${userId}`;

  try {
    const response = await axios.get(base_url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (err) {
    console.error('Error fetching user profile:', err);
    return null;
  }
}

function Profile() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      const profileData = await getUserProfile();
      if (profileData) {
        setUserProfile(profileData);
      }
    };
    fetchUserProfile();
  }, []);


  const handleLogout = () => {
    socket.emit('logout', userId);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('currentUserId');
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="w-full h-full p-4 flex flex-col items-center bg-gray-100 dark:bg-gray-800">
      {userProfile ? (
        <div className="w-full max-w-md bg-white dark:bg-gray-700 rounded-lg shadow-md p-6">
          <div className="flex flex-col items-center">
            <img
              className="w-24 h-24 rounded-full"
              src={userProfile.avatar || "https://via.placeholder.com/150"}
              alt="User Avatar"
            />
            <h1 className="text-2xl font-bold mt-4">{userProfile.firstName} {userProfile.lastName}</h1>
            <p className="text-gray-500 dark:text-gray-300 mt-2">{userProfile.email}</p>
            <p className="text-gray-700 dark:text-gray-400 mt-4">{userProfile.bio}</p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Logout
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Profile;

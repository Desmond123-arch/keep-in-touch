import { useEffect, useState } from "react";
import axios from "axios";

interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  bio: string;
}

const token = localStorage.getItem('token') || '';
const userId = localStorage.getItem('currentUserId') || '';

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

  useEffect(() => {
    const fetchUserProfile = async () => {
      const profileData = await getUserProfile();
      if (profileData) {
        setUserProfile(profileData);
      }
    };
    fetchUserProfile();
  }, []);

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
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Profile;

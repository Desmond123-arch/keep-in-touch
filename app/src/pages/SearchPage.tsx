import { useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

async function searchUsers(query, token) {
  const base_url = `http://localhost:3000/users/search?q=${query}`;

  try {
    const response = await axios.get(base_url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (err) {
    console.error('Error searching users:', err);
    return [];
  }
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('currentUserId');

  const handleSearchInput = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    const results = await searchUsers(searchQuery, token);
    setSearchResults(results);
  };

  const handleUserSelection = async (receiverId) => {
    // Start conversation or navigate to chat
    navigate(`/home?chatWith=${receiverId}`);
  };

  return (
    <div className="w-full h-full p-4">
      <form onSubmit={handleSearchSubmit} className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchInput}
          placeholder="Search for users..."
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
        <button type="submit" className="mt-2 p-2 bg-blue-500 text-white rounded-lg">
          Search
        </button>
      </form>
      <div>
        {searchResults.map((user) => (
          <button
            key={user._id}
            className="flex flex-row items-center gap-5 p-2 my-2 w-full"
            onClick={() => handleUserSelection(user._id)}
          >
            <img
              className="w-12 h-12 rounded-full"
              src="https://images.unsplash.com/photo-1725714834280-0c7584637d06?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="user-avatar"
            />
            <div className="w-[75%] text-start">
              <p className="font-bold">{user.firstName}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

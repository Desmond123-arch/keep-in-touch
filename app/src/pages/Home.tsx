import { useEffect, useState, useCallback, useRef } from "react";
import { FiSend } from "react-icons/fi";
import axios from "axios";
import io from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";

const socket = io("http://localhost:3000");

function Home() {
  const [recents, setRecents] = useState<Recents[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [myMessage, setMymessage] = useState<string>("");
  const [chats, setChats] = useState<ChatMessage | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const chatWith = query.get('chatWith');

  // Retrieve token and userId from session storage
  const token = sessionStorage.getItem('token') || '';
  const userId = sessionStorage.getItem('currentUserId') || '';

  // Function to fetch recent chats
  async function getRecents() {
    const base_url = `http://localhost:3000/users/my_chats/${userId}`;
    try {
      const response = await axios.get(base_url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      console.error('Error fetching recents:', err);
      return null;
    }
  }

  // Function to fetch chat messages
  async function getChats(receiverId: string) {
    const base_url = `http://localhost:3000/chat/conversation/${userId}/${receiverId}`;
    try {
      const response = await axios.get(base_url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      console.error('Error fetching chats:', err);
      return null;
    }
  }

  // Fetch recents and chat messages on component mount or when chatWith changes
  useEffect(() => {
    const fetchInitialData = async () => {
      const recentsData = await getRecents();
      if (recentsData) setRecents(recentsData);
      
      if (chatWith) {
        const chatData = await getChats(chatWith);
        if (chatData) setChats(chatData);
      }
    };

    fetchInitialData();
  }, [chatWith, token, userId]);

  const fetchChatMessages = useCallback(async (receiverId: string) => {
    const chatData = await getChats(receiverId);
    if (chatData) setChats(chatData);
  }, [userId, token]);

  const handleUserSelection = async (receiverId: string) => {
    setChats(null);
    setCurrentMessage(receiverId);
    await fetchChatMessages(receiverId);
  };

  const sendMessage = () => {
    if (myMessage.trim() === "") return;

    const messageObj = {
      sender: userId,
      receiver: currentMessage,
      message: myMessage,
    };

    socket.emit("sendMessage", messageObj);
    setMymessage("");
  };

  useEffect(() => {
    if (chatWith) {
      fetchChatMessages(chatWith);
      setCurrentMessage(chatWith);
    }
  }, [chatWith, fetchChatMessages]);

  useEffect(() => {
    socket.on("receiveMessage", (newMessage) => {
      if (chats && chats._id === newMessage.conversationId) {
        setChats(prevChats => ({
          ...prevChats,
          messages: [...prevChats.messages, newMessage],
        }));
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [chats]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chats]);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('currentUserId');
    setRecents([]); // Clear recents
    setChats(null); // Clear chats
    navigate('/login');
  };

  return (
    <div className="w-full h-full flex">
      <div className={`md:w-[30%] w-full h-full border-r-2 dark:border-gray-500 overflow-y-auto ${currentMessage ? 'hidden md:block' : ''}`}>
        <h1 className="text-2xl p-2 pl-2">Chats</h1>
        <div className="overflow-y-auto">
          {recents.map((receiver) => (
            <button
              key={receiver._id}
              className="flex flex-row items-center gap-5 p-2 my-2 w-full"
              onClick={async () => {
                await handleUserSelection(receiver._id);
              }}
            >
              <img
                className="w-12 h-12 rounded-full"
                src="https://images.unsplash.com/photo-1725714834280-0c7584637d06?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="user-avatar"
              />
              <div className="w-[75%] text-start">
                <p className="font-bold">{receiver.firstName}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className={`relative w-full md:w-[70%] ${currentMessage === "" ? "hidden md:block" : ""}`}>
        {currentMessage && (
          <button 
            className="sticky top-4 left-4 p-2 bg-gray-200 rounded-md md:hidden" 
            onClick={() => setCurrentMessage("")}
          >
            Back
          </button>
        )}
        <div
          className="h-[calc(100vh-100px)] overflow-y-auto p-4"
          ref={chatContainerRef}
        >
          {chats && chats.messages.map((msg) => (
            <div key={msg._id} className={`flex ${msg.sender === userId ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`p-2 rounded-lg ${msg.sender === userId ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
              >
                {msg.message}
              </div>
            </div>
          ))}
        </div>

        <div className={`absolute bottom-0 left-0 right-0 w-full p-2 flex items-center ${currentMessage !== "" ? "" : "hidden"}`}>
          <input
            type="text"
            className="w-full p-4 border border-gray-300 rounded-lg"
            value={myMessage}
            onChange={e => setMymessage(e.target.value)}
          />
          <button className="ml-2" onClick={sendMessage}>
            <FiSend size={30} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;

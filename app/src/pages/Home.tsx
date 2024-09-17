import { useEffect, useState, useCallback, useRef } from "react";
import { FiSend } from "react-icons/fi";
import axios from "axios";
import io from "socket.io-client";
import { useLocation } from "react-router-dom";

interface Recents {
  _id: string;
  firstName: string;
  lastName: string;
}

interface Message {
  _id: string;
  message: string;
  sender: string;
  receiver: string;
  conversationId: string;
  timestamp: string;
}

interface Participant {
  _id: string;
  firstName: string;
}

interface ChatMessage {
  _id: string;
  participants: Participant[];
  messages: Message[];
  lastUpdated: Date;
}

const socket = io("http://localhost:3000");

const userId = sessionStorage.getItem('currentUserId') || '';
const token = sessionStorage.getItem('token') || '';

async function getRecents() {
  const base_url = `http://localhost:3000/users/my_chats/${userId}`;

  try {
    const response = await axios.get(base_url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (err) {
    console.error('Error fetching recents:', err);
    return null;
  }
}

async function getChats(receiverId: string) {
  const base_url = `http://localhost:3000/chat/conversation/${userId}/${receiverId}`;

  try {
    const response = await axios.get(base_url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (err) {
    console.error('Error fetching chats:', err);
    return null;
  }
}

async function searchUsers(query: string) {
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
    return null;
  }
}

async function startConversation(receiverId: string) {
  const base_url = `http://localhost:3000/conversations`;

  try {
    const response = await axios.post(base_url, {
      senderId: userId,
      receiverId: receiverId
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (err) {
    console.error('Error starting conversation:', err);
    return null;
  }
}

function Home() {
  const [recents, setRecents] = useState<Recents[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [myMessage, setMymessage] = useState<string>("");
  const [chats, setChats] = useState<ChatMessage | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const chatWith = query.get('chatWith');

  // Fetch recents on initial render
  useEffect(() => {
    const fetchRecents = async () => {
      const recentsData = await getRecents();
      if (recentsData) {
        setRecents(recentsData);
      }
    };
    fetchRecents();
  }, []);

  // Fetch chat messages for a specific user
  const fetchChatMessages = useCallback(async (receiverId: string) => {
    const chatData = await getChats(receiverId);
    if (chatData) {
      setChats(chatData);
    }
  }, []);

  const handleUserSelection = async (userId: string) => {
    // Check if the selected user chat already exists in state
    const existingChat = chats && chats.participants.some(participant => participant._id === userId);

    if (!existingChat) {
      await startConversation(userId);
    }
    
    // Fetch and set chat messages for the selected user
    await fetchChatMessages(userId);
    setCurrentMessage(userId);
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

  const handleMymessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMymessage(event.target.value);
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

  return (
    <div className="w-full h-full flex">
      {/* Chat list, hide on medium screens when a conversation is open */}
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

      {/* Conversation view */}
      <div className={`relative w-full md:w-[70%] ${currentMessage === "" ? "hidden md:block" : ""}`}>
        {/* Back button */}
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
          {currentMessage !== "" && chats && chats.messages.map((message) => {
            const isSentByMe = message.sender === userId;
            return (
              <div key={message._id} className={`chat ${isSentByMe ? "chat-end" : "chat-start"}`}>
                <div className="chat-bubble">{message.message}</div>
              </div>
            );
          })}
        </div>

        {/* Message input, only show when a conversation is open */}
        <div className={`absolute bottom-0 left-0 right-0 w-full p-2 flex items-center ${currentMessage !== "" ? "" : "hidden"}`}>
          <input
            type="text"
            className="w-full p-4 border border-gray-300 rounded-lg"
            value={myMessage}
            onChange={handleMymessage}
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

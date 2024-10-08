import { useEffect, useState, useCallback, useRef } from "react";
import { FiSend } from "react-icons/fi";
import axios from "axios";
import io from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";
import { ImAttachment } from "react-icons/im";
import Image from "../components/Image";

const userId = sessionStorage.getItem("currentUserId") || "";


export const socket = io("http://localhost:3000", { query: { userId } });

interface Recents {
  _id: string;
  firstName: string;
  lastName: string;
  IsOnline: boolean;
}

interface Message {
  _id: string;
  message: string;
  sender: string;
  receiver: string;
  conversationId: string;
  timestamp: string;
  mimeType?: string;
  fileName?: string;
  type?: string;
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

function Home(this: any) {
  const [recents, setRecents] = useState<Recents[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [myMessage, setMymessage] = useState<string>("");
  const [chats, setChats] = useState<ChatMessage | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [onlineUsers, setOnlineUsers] = useState<Map<string, string>>(
    new Map()
  );

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { searchedUser } = location.state || {};
  const interval = 3000;

  const token = sessionStorage.getItem("token") || "";
  const userId = sessionStorage.getItem("currentUserId") || "";

  socket.emit("user-added", userId);

  async function getRecents() {
    const base_url = `http://localhost:3000/users/my_chats/${userId}`;
    try {
      const response = await axios.get(base_url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      console.error("Error fetching recents:", err);
      return null;
    }
  }

  async function getChats(receiverId: string) {
    const base_url = `http://localhost:3000/chat/conversation/${userId}/${receiverId}`;
    try {
      const response = await axios.get(base_url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      console.error("Error fetching chats:", err);
      return null;
    }
  }

  // Check if a user is online
  async function IsOnline(userId: string) {
    const base_url = `http://localhost:3000/users/IsOnline/${userId}`;
    try {
      const response = await axios.get(base_url);
      return response.data;
    } catch (err) {
      return false; // Return false if there'fs an error
    }
  }

  // Function to continuously check the status of all users in recents
  function checkStatus() {
    recents.forEach(async (recentUser) => {
      const isOnline = await IsOnline(recentUser._id);
      setOnlineUsers((prev) => {
        const updatedUsers = new Map(prev); // Clone the previous state
        if (isOnline) {
          updatedUsers.set(recentUser._id, "online");
        } else {
          updatedUsers.delete(recentUser._id);
        }
        return updatedUsers; // Return the new state
      });
    });
  }

  useEffect(() => {
    const statusInterval = setInterval(() => {
      if (recents.length > 0) {
        checkStatus(); // Only check status if recents are populated
      }
    }, interval);

    return () => clearInterval(statusInterval); // Cleanup interval on unmount
  }, [recents]);

  useEffect(() => {
    const fetchInitialData = async () => {
      const recentsData = await getRecents();
      if (recentsData) setRecents(recentsData);
  
      recentsData.forEach(async (element: { _id: string }) => {
        await IsOnline(element._id); // Check if each recent user is online initially
      });
  
      if (searchedUser) {
        // Fetch chat data for the searched user
        await handleUserSelection(searchedUser);
      }
    };
    fetchInitialData();
  }, [token, userId]);
  

  const fetchChatMessages = useCallback(
    async (receiverId: string) => {
      const chatData = await getChats(receiverId);
      if (chatData) setChats(chatData);
    },
    [userId, token]
  );

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
    };
  
    if (file) {
      const reader = new FileReader();
      
      reader.onloadend = () => {
        // Convert the result to base64
        const base64 = reader.result?.toString().replace(/^data:.*;base64,/, '') || '';
        
        // Update messageObj with file data
        messageObj.message = base64;
        messageObj.type = "file";
        messageObj.fileName = file.name;
        messageObj.mimeType = file.type;
  
        // Emit the message after the file has been read
        socket.emit("sendMessage", messageObj);
      };
  
      // Read the file as a Data URL
      reader.readAsDataURL(file);
    } else {
      // Handle sending a text message
      messageObj.message = myMessage;

    
      socket.emit("sendMessage", messageObj);
    }
  
    // Reset state after sending
    setMymessage("");
    setFile(null);
  };
  

  const selectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setMymessage(e.target.files[0].name); // Optional, remove if not needed
    }
  };

  const renderImage = (msg: Message) => {
    return (
      <Image key={msg._id} fileName={msg.fileName} base64Data={msg.message} />
    );
  };

  useEffect(() => {
    const handleReceiveMessage = (message: Message) => {
      console.log(message);
      setChats((prevChats) => {
        if (prevChats && prevChats._id === message.conversationId) {
          const updatedMessages = [...(prevChats.messages || []), message];
          return { ...prevChats, messages: updatedMessages };
        }
        return prevChats;
      });
    };
    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, chats]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chats]);

  return (
    <div className="w-full h-full flex">
      <div
        className={`md:w-[30%] w-full h-full border-r-2 dark:border-gray-500 overflow-y-auto ${
          currentMessage ? "hidden md:block" : ""
        }`}
      >
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
                {onlineUsers.has(receiver._id) ? <p>Online</p> : <p>Offline</p>}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div
        className={`relative w-full md:w-[70%] ${
          currentMessage === "" ? "hidden md:block" : ""
        }`}
      >
        {currentMessage && (
          <button
            className="sticky top-4 left-4 p-2 bg-gray-200 rounded-md md:hidden"
            onClick={() => setCurrentMessage("")}
          >
            Back
          </button>
        )}
        <div
          className="h-[calc(100vh-100px)] overflow-y-auto p-4 py-10 pb-[5rem] md:pb-2"
          ref={chatContainerRef}
        >
          {chats &&
            chats.messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${
                  msg.sender === userId ? "justify-end" : "justify-start"
                }`}
                
              >
                {msg.type === "file" ? (
                  <div>
                    {renderImage(msg)}
                  </div>
                ) : (
                  
                  <div
                    className={`p-2 rounded-lg ${
                      msg.sender === userId
                        ? " text-white chat-end "
                        : "text-black chat-start"
                    }`}
                  >
                   <div className="chat-bubble">
                   {msg.message}
                   </div>
                  </div>
                )}
              </div>
            ))}
        </div>

        <div
          className={`mt-5 md:mb-2 rounded-md bg-gray-950 absolute bottom-0 left-0 right-0  w-full flex items-center  ${
            currentMessage !== "" ? "" : "hidden"
          }`}
        >
          <input
            type="text"
            className="w-full p-4 rounded-lg bg-gray-950 "
            value={myMessage}
            onChange={(e) => setMymessage(e.target.value)}
          />
          <div className="flex mr-4 w-[40%] md:w-[15%]">
            <div className="relative w-1/2">
              <ImAttachment size={30} className="absolute left-2" />
              <input
                accept=".jpg, .jpeg .png, .svg, .webp"
                className="border w-full opacity-0"
                type="file"
                name="bgfile"
                id="bgfile"
                onChange={selectFile}
              />
            </div>
            <button className="w-[40%]" onClick={sendMessage}>
              <FiSend size={30} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

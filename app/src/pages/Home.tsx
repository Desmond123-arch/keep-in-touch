import { useEffect, useState, useCallback, useRef } from "react";
import { FiSend } from "react-icons/fi";
import axios from "axios";
import io from "socket.io-client";

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
  _id: string; // Conversation ID
  participants: Participant[]; // Participants in the conversation
  messages: Message[];
  lastUpdated: Date;
}

// Set up your Socket.IO connection (replace with your actual server URL)
const socket = io("http://localhost:3000");

const userId = localStorage.getItem('currentUserId');

async function getRecents() {
  const base_url = `http://localhost:3000/users/my_chats/${userId}`;
  try {
    const response = await axios.get(base_url, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    console.log(response.data);
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
      }
    });
    console.log(response.data);
    return response.data; // Return the full conversation data
  } catch (err) {
    console.error('Error fetching chats:', err);
    return null;
  }
}

function Home() {
  const [recents, setRecents] = useState<Recents[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [myMessage, setMymessage] = useState<string>("");
  const [chats, setChats] = useState<ChatMessage | null>(null);
  
  // Replace with your actual user ID
  const userId = localStorage.getItem('currentUserId'); // Current logged-in user ID

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const fetchChats = useCallback(async () => {
    const recentsData = await getRecents();
    if (recentsData) {
      setRecents(recentsData);
    }
  }, []);

  const fetchChatMessages = async (receiverId: string) => {
    const chatData = await getChats(receiverId);
    if (chatData) {
      setChats(chatData);
    }
  };

  const sendMessage = () => {
    const messageObj = {
      sender: userId, // Current user ID
      receiver: '66e873ac5404c4bbe872190c', // Replace with actual receiver ID
      message: myMessage,
    };

    // Emit the message via Socket.IO
    socket.emit("sendMessage", messageObj);

    // Clear the input field after sending
    setMymessage("");
  };

  const handleMymessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMymessage(event.target.value);
  };

  useEffect(() => {
    fetchChats();

    socket.on("receiveMessage", (newMessage) => {
      if (chats) {
        setChats((prevChats) => {
          if (prevChats && prevChats._id === newMessage.conversationId) {
            return {
              ...prevChats,
              messages: [...prevChats.messages, newMessage],
            };
          }
          return prevChats;
        });
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [fetchChats, chats]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chats]);

  return (
    <div className="w-full h-full flex">
      <div className="md:w-[30%] h-full w-full border-r-2 dark:border-gray-500 overflow-y-auto">
        <h1 className="text-2xl p-2 pl-2">Chats</h1>
        <div className="overflow-y-auto">
          {recents.map((receiver) => (
            <button
              key={receiver._id}
              id={receiver.firstName}
              className="flex flex-row items-center gap-5 p-2 my-2 w-full"
              onClick={async () => {
                setCurrentMessage(receiver._id);
                await fetchChatMessages(receiver._id);
              }}
            >
              <div>
                <img
                  className="w-12 h-12 rounded-full"
                  src="https://images.unsplash.com/photo-1725714834280-0c7584637d06?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="user-avatar"
                />
              </div>
              <div className="w-[75%] text-start">
                <p className="font-bold">{receiver.firstName}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div
        className={`relative w-[70%] hidden md:block ${currentMessage === "" ? "bg-image" : ""}`}
      >
        <div
          className="h-[calc(100vh-100px)] overflow-y-auto p-4"
          ref={chatContainerRef}
        >
          {currentMessage !== "" && chats && chats.messages.map((message) => {
            
            const isSentByMe = message.sender === userId; // Check if the message is sent by the current user
            return (
              // <div key={message._id} className={`chat ${isSentByMe ? "chat-start" : "chat-end"} mb-2`}>
              //   <div className={`p-2 rounded-lg ${isSentByMe ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}>
              //     {message.message}
              //   </div>
              // </div>
              <div key={message._id} className={`chat ${isSentByMe? "chat-end": "chat-start"}`}>
                <div className="chat-bubble">
                  {message.message}
                </div>
              </div>
            );
          })}
        </div>
        <div
          className={`absolute bottom-0 left-0 right-0 w-full p-2 flex items-center ${currentMessage !== "" ? "" : "hidden"}`}
        >
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

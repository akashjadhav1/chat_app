import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { getSender } from "../config/chatLogics";
import ProfileModel from "./ProfileModel";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from "lottie-react";
import typingAnimation from "../animation/typingAnimation.json";
import loadingAnimation from "../animation/loadingAnimation.json";
import { toast } from "react-toastify";
import showProf from "../assets/hidepassword.svg";
import send from "../assets/send.svg";

const ENDPOINT = "https://chat-app-wybw.onrender.com/";
let socket, selectedChatCompare;

function SingleChat({ fetchAgain, setFetchAgain }) {
  const { user, selectedChat } = ChatState();
  const [showProfile, setShowProfile] = useState(false);
  const [showUpdateGroupModal, setShowUpdateGroupModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handleProfileToggle = () => setShowProfile(!showProfile);
  const handleUpdateGroupChatModal = () => setShowUpdateGroupModal(true);
  const closeUpdateGroupChatModal = () => setShowUpdateGroupModal(false);
  const closeProfileModal = () => setShowProfile(false);

  const toastifyConfig = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;

    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const sendMessage = async (event) => {
    if ((event.key === "Enter" || event.type === "click") && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      setLoading(true);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          "https://chat-app-wybw.onrender.com/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit("new message", data);
        setMessages((prevMessages) => [...prevMessages, data]);
        setNewMessage("");
        setLoading(false);
      } catch (error) {
        toast.error(error, toastifyConfig);
        setLoading(false);
      }
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `https://chat-app-wybw.onrender.com/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast.error(error, toastifyConfig);
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
      selectedChatCompare = selectedChat;
    }

    return () => {
      socket.off("message received");
    };
  }, [selectedChat]);

  return (
    <div className="flex flex-col items-center w-full h-full lg:max-w-[70vw] p-3">
      {selectedChat ? (
        <div className="flex flex-col w-full h-full">
          <div className="flex items-center justify-between text-lg font-semibold">
            {selectedChat.isGroupChat ? (
              <>
                <span>{selectedChat.chatName.toUpperCase()}</span>
                <img
                  src={showProf}
                  alt="Profile"
                  onClick={handleUpdateGroupChatModal}
                  className="cursor-pointer w-5 h-5"
                />
              </>
            ) : (
              <>
                {getSender(user, selectedChat.users).toUpperCase()}
                <img
                  src={showProf}
                  alt="Profile"
                  onClick={handleProfileToggle}
                  className="cursor-pointer w-5 h-5"
                />
              </>
            )}
          </div>

          {/* Chat Area */}
          <div className="flex flex-col justify-end p-3 bg-gray-100 w-full rounded-lg overflow-y-scroll mt-4 h-full">
            {loading ? (
              <Lottie
                animationData={loadingAnimation}
                style={{ width: 50, margin: "0 auto" }}
              />
            ) : (
              <ScrollableChat messages={messages} />
            )}
            {isTyping && (
              <Lottie
                animationData={typingAnimation}
                style={{ width: 60, margin: "0 auto" }}
              />
            )}

            {/* Input Area */}
            <div className="flex items-center border rounded-lg w-full">
              <input
                onChange={typingHandler}
                value={newMessage}
                type="text"
                placeholder="Type here..."
                className="p-2 text-sm border-none outline-none rounded-l-lg w-full sm:h-10 sm:text-base"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 lg:w-9 lg:h-9 text-white lg:px-4 px-2 py-2 rounded-r-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
              >
                <img src={send} alt="Send" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-lg">
          Click on a User to Start Chatting
        </div>
      )}
    </div>
  );
}

export default SingleChat;

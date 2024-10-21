import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { getSender, getSenderFull } from "../config/chatLogics";
import ProfileModel from "./ProfileModel";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from "lottie-react"
import Animation from '../animation/Animation.json'

const ENDPOINT = "http://localhost:8000";
let socket, selectedChatCompare;

function SingleChat({ fetchAgain, setFetchAgain }) {
  const { user, selectedChat } = ChatState();
  const [showProfile, setShowProfile] = useState(false); // State to toggle profile modal
  const [showUpdateGroupModal, setShowUpdateGroupModal] = useState(false); // State to toggle group chat modal

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handleProfileToggle = () => {
    setShowProfile(!showProfile); // Toggle profile modal
  };

  const handleUpdateGroupChatModal = () => {
    setShowUpdateGroupModal(true); // Show the group chat modal
  };

  const closeUpdateGroupChatModal = () => {
    setShowUpdateGroupModal(false); // Hide the group chat modal
  };

  const closeProfileModal = () => {
    setShowProfile(false); // Hide the profile modal
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
    if (event.key === "Enter" && newMessage) {
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
          "http://localhost:8000/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit("new message", data);
        setMessages((prevMessages) => [...prevMessages, data]);
        setNewMessage(""); // Clear the input after sending the message
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:8000/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true)); // Set isTyping to true when 'typing' event is received
    socket.on("stop typing", () => setIsTyping(false)); // Set isTyping to false when 'stop typing' event is received

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
      selectedChatCompare = selectedChat;
    }

    // Clean up event listener when component unmounts or chat changes
    return () => {
      socket.off("message received");
    };
  }, [selectedChat]);

  useEffect(() => {
    if (!socket) return;

    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        return;
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
      }
    });

    // Clean up the event listener when component unmounts or chat changes
    return () => {
      socket.off("message received");
    };
  }, [selectedChatCompare]);





  return (
    <div>
      {selectedChat ? (
        <div>
          {!selectedChat.isGroupChat ? (
            <div className="font-semibold font-mono flex items-center justify-between">
              {/* Display sender name */}
              {getSender(user, selectedChat.users).toUpperCase()}

              {/* Button to toggle profile modal */}
              <button
                onClick={handleProfileToggle}
                className="ml-2 text-blue-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>

              {/* Show the profile modal when the button is clicked */}
              {showProfile && (
                <ProfileModel
                  user={getSenderFull(user, selectedChat.users)}
                  closeProfileModal={closeProfileModal}
                />
              )}
            </div>
          ) : (
            <>
              <div className="font-semibold font-mono flex items-center justify-between">
                <span>{selectedChat.chatName.toUpperCase()}</span>
                <button
                  onClick={handleUpdateGroupChatModal}
                  className="ml-2 text-blue-600"
                >
                  See Profile
                </button>
              </div>

              {/* Show the update group chat modal */}
              {showUpdateGroupModal && (
                <UpdateGroupChatModal
                  user={user}
                  closeUpdateGroupChatModal={closeUpdateGroupChatModal}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              )}
            </>
          )}

          <div
            onKeyDown={sendMessage} // Use onKeyDown instead of onKeyUp
            className="flex flex-col justify-end p-3 bg-[#E8E8E8] w-[70vw] h-[70vh] rounded-lg overflow-y-hidden"
          >
            {loading ? (
              <p>Loading...</p>
            ) : (
              <ScrollableChat messages={messages} /> // Pass messages as a prop
            )}
            {isTyping && <Lottie
                animationData={Animation}
                loop={true}
                autoplay={true}
                style={{ width: 70, marginBottom: 15, marginLeft: 0 }}
              />} {/* Show loading when someone is typing */}
            <input
              onChange={typingHandler}
              value={newMessage} // Bind the input value to state
              type="text"
              placeholder="Type here...."
              className="border-none p-1 rounded"
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-[80vh]">
          <p className="text-3xl p-3 font-sans">
            Click On a User to Start Chatting
          </p>
        </div>
      )}
    </div>
  );
}

export default SingleChat;

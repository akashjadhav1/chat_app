import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import axios from "axios";
import { getSender } from "../config/chatLogics";
import GroupChatModel from "./GroupChatModel";
import Lottie from "lottie-react";
import loadingAnimation from "../animation/loadingAnimation.json";
import { toast } from "react-toastify";

function MyChats({ fetchAgain }) {
  const [loggedUser, setLoggedUser] = useState();
  const [groupChatDrawer, setGroupChatDrawer] = useState(false);
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const toastifyConfig = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        "https://chat-app-wybw.onrender.com/api/chats",
        config
      );
      setChats(data);
      toast.success("Chats fetched successfully", toastifyConfig);
    } catch (error) {
      toast.error("Failed to fetch chats", toastifyConfig);
    }
  };

  const onClose = () => {
    setGroupChatDrawer(false);
  };
  const onOpenGroupChat = () => {
    setGroupChatDrawer(true);
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("user")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <div
      className={`flex flex-col items-center p-3 bg-white w-full sm:w-[100%] md:w-[31%] rounded-xl border border-gray-200 text-black ${
        selectedChat ? "hidden sm:flex" : "flex"
      }`}
    >
      <div className="pb-3 px-3 text-md font-sans flex w-full justify-between items-center">
        <p className="text-sm md:text-base">My Chats</p>
        <GroupChatModel onClose={onClose} groupChatDrawer={groupChatDrawer} fetchChats={fetchChats} />
        <button
          onClick={onOpenGroupChat}
          className="flex items-center rounded text-sm sm:text-md bg-gray-300 m-2 "
        >
          New Group Chat
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4 ml-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </span>
        </button>
      </div>
      <div className="flex flex-col p-3 bg-gray-100 w-full h-full rounded-lg overflow-hidden">
        {chats ? (
          <div className="flex flex-col gap-2 overflow-y-auto">
            {chats.map((chat) => (
              <div
                className={`cursor-pointer py-2 px-3 rounded-md ${
                  selectedChat === chat
                    ? "bg-gray-300 text-teal-600"
                    : "bg-teal-500 text-white"
                }`}
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
              >
                <p className="text-xs sm:text-sm md:text-base">
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <Lottie
            animationData={loadingAnimation}
            loop
            autoplay
            style={{ width: 70, marginBottom: 15, marginLeft: 0 }}
          />
        )}
      </div>
    </div>
  );
}

export default MyChats;

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
  }

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
      toast.success("Fetched chats successfully", toastifyConfig);
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
      className={`sm:${selectedChat ? "hidden" : "flex"} md:flex flex-col items-center p-3 bg-white w-1/2 md:w-1/3 rounded-xl border border-black text-black`}
      style={{ height: 'auto' }}
    >
      <div className="lg:pb-3 lg:px-3 text-md font-sans flex w-full justify-between items-center">
        <p className="lg:text-sm text-xs">My Chats</p>
        <GroupChatModel onClose={onClose} groupChatDrawer={groupChatDrawer} fetchChats={fetchChats} />
        <button onClick={onOpenGroupChat} className="lg:flex rounded lg:text-md lg:text-sm text-xs bg-gray-300 lg:p-1">
          New Group Chat
          <span className="lg:block hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </span>
        </button>
      </div>
      <div className="flex flex-col p-3 bg-[#F8F8F8] w-full h-auto rounded overflow-y-auto max-h-96">
        {chats ? (
          <div className="overflow-y-auto">
            {chats.map((chat) => (
              <div
                className={`cursor-pointer py-2 px-3 lg:text-sm text-xs mt-2 rounded ${
                  selectedChat === chat ? "bg-[#E8E8E8] text-[#38B2AC]" : "bg-[#38B2AC] text-[#E8E8E8]"
                }`}
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
              >
                <p>
                  {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
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

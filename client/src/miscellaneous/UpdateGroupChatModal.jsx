import React, { useState } from "react";
import { ChatState } from "../context/ChatProvider";
import UserBadgeItem from "./UserBadgeItem";
import axios from "axios";
import UserListItem from "./UserListItem";
import Lottie from "lottie-react";
import loadingAnimation from '../animation/loadingAnimation.json'
import { toast } from "react-toastify";

function UpdateGroupChatModal({
  closeUpdateGroupChatModal,
  fetchAgain,
  setFetchAgain,
}) {
  const { selectedChat, setSelectedChat, user,fetchMessages } = ChatState();
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

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



  const handleRenameGroup = async () => {
    if (!groupChatName) {
      toast.warning("please select a group",toastifyConfig);
      return;
    }
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "https://chat-app-wybw.onrender.com/api/chats/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast.error(error,toastifyConfig);
    }
  };

  const handleRemoveFromGroup = async (user1) => {
    // Check if the current user is the group admin
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast.warning("Only admins can remove someone!",toastifyConfig);
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      // API call to remove the user from the group
      const { data } = await axios.put(
        "https://chat-app-wybw.onrender.com/api/chats/groupremove",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      // If the current user is removing themselves, clear the selected chat
      if (user1._id === user._id) {
        setSelectedChat();
      } else {
        setSelectedChat(data); // Update the chat with the new group info
      }

      setFetchAgain(!fetchAgain); // Refresh the group data
      fetchMessages();
      closeUpdateGroupChatModal();
      setLoading(false);
      toast.success("Group chat updated successfully",toastifyConfig)

    } catch (error) {
      toast.error("Error in handleRemoveFromGroup:",toastifyConfig);
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `https://chat-app-wybw.onrender.com/api/user?search=${query}`,
        config
      );

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setLoading(false);
      toast.error(error,toastifyConfig);
    }
  };

  const handleAddUser = async (user1) => {
    // Check if the user being added is already in the group
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      console.log("User already added in the group");
      return;
    }

    // Check if the current user (admin) is the one trying to add
    if (selectedChat.groupAdmin._id !== user._id) {
      console.log("Only admins can add someone!");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "https://chat-app-wybw.onrender.com/api/chats/groupadd",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );
      setSelectedChat(data); // Update the chat with the new group info
      setFetchAgain(!fetchAgain); // Trigger a re-fetch
      setLoading(false);
    } catch (error) {
      toast.error(error,toastifyConfig);
      setLoading(false);
    }
  };

  return (
    <div className="fixed font-serif inset-0 z-50 flex items-center justify-center text-black bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg relative">
        <h2 className="text-xl font-bold mb-4">Group Information</h2>
        <h3 className="text-xl font-bold">{selectedChat.chatName}</h3>

        <div className="flex">
          {selectedChat?.users.map((u) => (
            <UserBadgeItem
              key={u._id}
              user={u}
              handleRemoveFromGroup={() => handleRemoveFromGroup(u)}
            />
          ))}
        </div>
        <div className="flex mt-4 ">
          <input
            type="text"
            className="border rounded placeholder:px-2"
            value={groupChatName}
            placeholder="Chat Name"
            onChange={(e) => setGroupChatName(e.target.value)}
          />
          <button
            onClick={handleRenameGroup}
            className="text-white bg-green-600 rounded p-1 mx-3"
          >
            Update
          </button>
        </div>
        <div className="mt-2 border p-1 rounded">
          <input
            type="text"
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Add user to group"
          />
        </div>
        <div className="h-[30vh] overflow-y-auto">
          {loading ? (
            <Lottie
                animationData={loadingAnimation}
                loop={true}
                autoplay={true}
                style={{ width: 70, marginBottom: 15, marginLeft: 0 }}
              />
          ) : (
            searchResult
              ?.slice(0, 4)
              .map((user) => (
                <UserListItem
                  handleFunction={() => handleAddUser(user)}
                  user={user}
                  key={user._id}
                />
              ))
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent the click from bubbling up
            handleRemoveFromGroup(user);
          }}
          className="text-white bg-red-500 px-4 py-2 rounded mt-4"
        >
          Leave Group
        </button>
        <button
          onClick={closeUpdateGroupChatModal}
          className="text-white bg-red-500 px-4 py-2 float-end rounded mt-4"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default UpdateGroupChatModal;

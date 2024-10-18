import React, { useState } from "react";
import { ChatState } from "../context/ChatProvider";
import axios from "axios";
import UserListItem from "./UserListItem";

function GroupChatModel({ children, onClose, groupChatDrawer }) {
  const { user } = ChatState();
  const [group, setGroup] = useState({
    chatName: "",
    addUser: "",
  });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [groupChatName, setGroupChatName] = useState("");

  console.log(search);
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
        `http://localhost:8000/api/user?search=${query}`,
        config
      );

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedUsers || !groupChatName) {
      console.log("Please fill all the fields");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "http://localhost:8000/api/chats/groups",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );

      setChats([data, ...chats]);
      console.log("Group chat created successfully");
    } catch (error) {
      console.error("Error creating group chat", error);
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      console.log("User already added");
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDeleteUser = (userToDelete) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== userToDelete._id));
  };

  return (
    <div className={`${groupChatDrawer ? "block" : "hidden"}`}>
      <div className="fixed font-serif inset-0 z-50 flex items-center justify-center text-black bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg relative">
          <div>
            <h2 className="text-xl font-bold mb-4">Create Group Chat</h2>
            <form>
              <input
                type="text"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                name="chatName"
                className="border-2 border-blue-400 rounded p-2 mb-3 text-sm placeholder:text-gray-400"
                placeholder="Chat Name"
              />
              <input
                type="text"
                onChange={(e) => handleSearch(e.target.value)}
                name="addUser"
                className="border-2 p-2 border-blue-400 rounded text-sm placeholder:text-gray-400"
                placeholder="Add Users (e.g., John, Jane)"
              />
            </form>

            <div className="mb-4">
              {selectedUsers.map((u) => (
                <span
                  key={u._id}
                  className="inline-flex items-center px-2 py-1 me-2 text-sm font-medium text-purple-800 bg-purple-100 rounded dark:bg-purple-900 dark:text-purple-300"
                >
                  {u.name}
                  <button
                    onClick={() => handleDeleteUser(u)}
                    type="button"
                    className="inline-flex items-center p-1 ms-2 text-sm text-purple-400 bg-transparent rounded-sm hover:bg-purple-200 hover:text-purple-900 dark:hover:bg-purple-800 dark:hover:text-purple-300"
                    aria-label="Remove"
                  >
                    <svg
                      className="w-2 h-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 1l6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                  </button>
                </span>
              ))}
            </div>

            {loading ? (
              <div>Loading...</div>
            ) : (
              searchResult?.slice(0, 4).map((user) => (
                <UserListItem
                  handleFunction={() => handleGroup(user)}
                  user={user}
                  key={user._id}
                />
              ))
            )}

            <button
              className="border bg-blue-400 p-1 rounded mb-3 float-end"
              onClick={handleSubmit}
            >
              Create Chat
            </button>
          </div>
          <button
            className="text-white bg-red-500 px-4 py-1 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default GroupChatModel;

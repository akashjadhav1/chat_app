import React, { useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { getSender, getSenderFull } from "../config/chatLogics";
import ProfileModel from "./ProfileModel";
import UpdateGroupChatModal from "./UpdateGroupChatModal";

function SingleChat({ fetchAgain, setFetchAgain }) {
  const { user, selectedChat } = ChatState();
  const [showProfile, setShowProfile] = useState(false); // State to toggle profile modal
  const [showUpdateGroupModal, setShowUpdateGroupModal] = useState(false); // State to toggle group chat modal

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

  return (
    <div>
      {selectedChat ? (
        <div>
          {!selectedChat.isGroupChat ? (
            <div className="font-semibold font-mono flex items-center justify-between">
              {/* Display sender name */}
              {getSender(user, selectedChat.users).toUpperCase()}

              {/* Button to toggle profile modal */}
              <button onClick={handleProfileToggle} className="ml-2 text-blue-600">
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
                />
              )}
            </>
          )}

          <div className="flex flex-col justify-end p-3 bg-[#E8E8E8] w-[70vw] h-[70vh] rounded-lg overflow-y-hidden">
            {/* Chat messages will go here */}
            <input type="text" placeholder="Type here...." className="border-none p-1 rounded" />
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

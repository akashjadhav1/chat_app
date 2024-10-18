import React, { useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { getSender, getSenderFull } from "../config/chatLogics";
import ProfileModel from "./ProfileModel";

function SingleChat({ fetchAgain, setFetchAgain }) {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [showProfile, setShowProfile] = useState(false); // State to toggle profile modal

  const handleProfileToggle = () => {
    setShowProfile(!showProfile); // Toggle the state on clicking the icon
  };

  return (
    <div>
      {selectedChat ? (
        <div>
          {!selectedChat.isGroupChat ? (
            <div className="font-semibold font-mono flex items-center">
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

              {/* Show the profile modal when icon is clicked */}
              {showProfile && (
                <ProfileModel
                  user={getSenderFull(user, selectedChat.users)}
                  onClose={() => setShowProfile(false)} // Pass a method to close the modal
                />
              )}
            </div>
          ) : (
            <>
              {selectedChat.chatName.toUpperCase()}
              {/* Uncomment and implement this when needed */}
              {/* <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} /> */}
            </>
          )}
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

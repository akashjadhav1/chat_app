import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { isSameSender, isLastMessage, isSameSenderMargin } from "../config/chatLogics";
import { ChatState } from "../context/ChatProvider";

function ScrollableChat({ messages }) {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div key={m._id} className="message-wrapper flex items-center mb-2">
            {/* Check if it's the same sender or the last message and display the avatar */}
            {(isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) && (
              <div className="mr-2">
                <img
                  className="w-8 h-8 rounded-full"
                  src={m.sender.pic?m.sender.pic:m.sender.picture}  // Display sender's profile picture
                  alt={m.sender.name} // Alt text for accessibility
                />
              </div>
            )}

            {/* Display the message content */}
            <span style={{ marginLeft: isSameSenderMargin(messages, m, i, user._id) }} className={`message-content ${m.sender._id===user._id?"bg-[#BEE3F8] float-right":"bg-[#B9F5D0]"} max-w-[75%] p-2 rounded-lg`}>
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
}

export default ScrollableChat;

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
            {/* Display avatar if it's the same sender or the last message */}
            {(isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) && (
              <div className="mr-2">
                <img
                  className="w-8 h-8 rounded-full"
                  src={m.sender.pic || m.sender.picture}
                  alt={m.sender.name}
                />
              </div>
            )}

            {/* Display message content, applying new line class for long messages */}
            <span
  style={{
    marginLeft: isSameSenderMargin(messages, m, i, user._id),
    whiteSpace: "pre-wrap", // Ensures wrapping for long text
    wordWrap: "break-word"   // Breaks words if they exceed container width
  }}
  className={`message-content ${
    m.sender._id === user._id ? "bg-[#BEE3F8] float-right" : "bg-[#B9F5D0]"
  } max-w-[75%] text-xs p-2 rounded-lg`}
>
  {m.content}
</span>

          </div>
        ))}
    </ScrollableFeed>
  );
}

export default ScrollableChat;

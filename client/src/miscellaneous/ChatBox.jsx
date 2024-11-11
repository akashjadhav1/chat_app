import React from 'react';
import { ChatState } from '../context/ChatProvider';
import SingleChat from './SingleChat';

function ChatBox({ fetchAgain, setFetchAgain }) {
  const { selectedChat } = ChatState();

  return (
    <div className="flex items-center flex-col p-3 mx-2 bg-white rounded-lg border-1 border-black 
      w-[60%] md:w-3/4 lg:w-2/3 xl:w-full">
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
}

export default ChatBox;

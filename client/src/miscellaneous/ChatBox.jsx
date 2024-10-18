import React from 'react'
import { ChatState } from '../context/ChatProvider'
import SingleChat from './SingleChat';

function ChatBox({fetchAgain,setFetchAgain}) {
  const {selectedChat} = ChatState();
  return (
    <div className='flex items-center flex-col p-3 mx-2 bg-white w-full rounded-lg border-1 border-black'>
      <SingleChat fetchAgain={fetchAgain}  setFetchAgain={setFetchAgain}/>
    </div>
  )
}

export default ChatBox

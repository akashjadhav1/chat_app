import React, { useEffect,useState } from 'react'
import axios from 'axios'
import { ChatState } from '../context/ChatProvider'
import SideDrawer from '../miscellaneous/SideDrawer';
import MyChats from '../miscellaneous/MyChats';
import ChatBox from '../miscellaneous/ChatBox';

function ChatPage() {
const {user} = ChatState();
const [fetchAgain,setFetchAgain] = useState()
useEffect(()=>{

},[user]);
  return (
    <div className=''>
      {user && <SideDrawer/>}
      <div className='flex justify-between w-[100%] h-[91.5vh] p-10'>
        {user && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </div>
    </div>
  )
}

export default ChatPage

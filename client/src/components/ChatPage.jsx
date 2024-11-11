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
      <div className='flex lg:w-[100%] lg:h-[91.5vh] lg:p-10 p-1'>
        {user && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </div>

      
    </div>
  )
}

export default ChatPage

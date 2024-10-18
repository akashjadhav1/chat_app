import { createContext, useContext, useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";

const chatContext = createContext();

function ChatProvider({children}) {
    
    const [user,setUser] = useState();
    const [selectedChat,setSelectedChat] = useState()
    const [chats,setChats] = useState([]);
    // const navigate = useNavigate();

    useEffect(()=>{
    const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);

        // if(!userData){
        //     navigate("/")
        // }
    },[])
  return (
    <chatContext.Provider value={{user,setUser,selectedChat,setSelectedChat,chats,setChats}}>{children}</chatContext.Provider>
  )
}

export const ChatState = ()=>{
    return useContext(chatContext)
}



export default ChatProvider

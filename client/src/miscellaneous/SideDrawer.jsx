import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import profile from "../assets/profile.svg";
import ProfileModel from "./ProfileModel"; // Corrected the import
import axios from "axios";
import LoadingDrawerSekeleton from "../skeleton/LoadingDrawerSekeleton";
import UserListItem from "./UserListItem";
import { toast } from "react-toastify";

function SideDrawer() {
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const { user,chats,setChats,setSelectedChat } = ChatState();

  const toastifyConfig = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  }

  const handleProfileClick = () => {
    setShowProfileModal(true); // Show modal when "My Profile" is clicked
  };

  const closeProfileModal = () => {
    setShowProfileModal(false); // Close modal when required
  };

  const handleDrawerClick = () => {
    setShowDrawer(true);
  };
  const closeDrawer = () => {
    setShowDrawer(false); // Close modal when required
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const handleSearch = async () => {
    if (!search) {
      toast.warning("Please enter something in search",toastifyConfig);
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`https://chat-app-wybw.onrender.com/api/user?search=${search}`, config);
      
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast.error(error,toastifyConfig);
      setLoading(false);
    }
  };


  const accessChat = async(userId)=>{
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const {data} = await axios.post("https://chat-app-wybw.onrender.com/api/chats",{userId},config)
      if(!chats.find((c)=>c._id ===data._id)) 
      setChats([data,...chats])
      setSelectedChat(data);
      setLoadingChat(false);
      closeDrawer();
    } catch (error) {
      toast.error(error,toastifyConfig);
    }
   
  }

  useEffect(() => {}, [user]);

  return (
    <>
      <div className="flex justify-between items-center bg-white w-[100%] p-[5px 10px 5px 10px] border-2 border-black">
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            onClick={handleDrawerClick}
            type="search"
            id="default-search"
            className="block w-[80%] p-2 ps-8 text-sm text-black border hover:bg-gray-200 rounded-lg dark:placeholder-gray-400"
            placeholder="Search User"
            required
            autoComplete="off"
          />
        </div>

        <div>
          <h1 className="text-2xl text-black font-serif">ChatsApp</h1>
        </div>

        <div className="">
          <div className="dropdown relative inline-flex group">
            {user.picture ? (
              <img
                id="dropdown-hover"
                src={user.picture}
                alt={user.name}
                className="dropdown-toggle mx-7 w-10 h-10 rounded-full cursor-pointer bg-white shadow-xs transition-all duration-500 hover:shadow-lg"
              />
            ) : (
              <img
                id="dropdown-hover"
                src={profile}
                alt={user.name}
                className="dropdown-toggle mx-7 w-10 h-10 rounded-full cursor-pointer bg-white shadow-xs transition-all duration-500 hover:shadow-lg"
              />
            )}

            <div
              className="dropdown-menu rounded-xl shadow-lg bg-white absolute top-8 right-0 w-[200px] mt-2 hidden group-hover:block"
              aria-labelledby="dropdown-hover"
            >
              <ul className="py-2">
                <li onClick={handleProfileClick}>
                  <a
                    className="block px-6 py-2 hover:bg-gray-100 text-gray-900 font-medium"
                    href="/"
                  >
                    My Profile
                  </a>
                </li>

                <li onClick={handleLogout}>
                  <a
                    className="block px-6 py-2 hover:bg-gray-100 text-red-500 font-medium"
                    href="/"
                  >
                    Log Out
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Conditionally render Profile Modal */}
        {showProfileModal && (
          <ProfileModel user={user} closeProfileModal={closeProfileModal} />
        )}
      </div>
      <div className={`${showDrawer ? "block" : "hidden"}`}>
  <div class="absolute top-0 w-[24%] text-black">
    <div className="bg-white h-[100vh] border-2 border-gray-500 rounded shadow-red-600 shadow-xl">
      <div className="relative">
        <p className="font-bold text-md text-center mb-4">Search User</p>
        <div className="absolute inset-y-0 start-2 top-11 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>

        <div className="flex items-center">
          <input
            type="search"
            id="default-search"
            className="block w-[80%] p-2 mx-2 ps-8 text-sm text-black border hover:bg-gray-200 rounded-lg dark:placeholder-gray-400"
            placeholder="Search User"
            onChange={(e)=>setSearch(e.target.value)}
            required
          />
          <button
            onClick={handleSearch}
            className="bg-gray-500 hover:bg-blue-500 text-white px-2 py-1 rounded-lg ml-0"
          >
            Go
          </button>
        </div>
      </div>

      <div
        onClick={closeDrawer}
        className="absolute top-1 left-[85%] hover:bg-gray-200 w-8 text-center rounded-md"
      >
        <button
          class="close-button"
          aria-label="Close alert"
          type="button"
          data-close
        >
          <span aria-hidden="true" className="text-3xl">
            &times;
          </span>
        </button>
      </div>
      <div className="">
      {loading===true ? <LoadingDrawerSekeleton/> : (searchResult?.map(user=>(
        <UserListItem key={user._id} user={user} handleFunction={()=>accessChat(user._id)}>

        </UserListItem>
      )))}
      </div>
     
    </div>
  </div>
</div>

    </>
  );
}

export default SideDrawer;

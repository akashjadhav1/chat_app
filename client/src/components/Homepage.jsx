import React, { useEffect, useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'



function Homepage() {
  const [activeTab, setActiveTab] = useState("login");
 const navigate = useNavigate();

  const handleTabClick = (elem) => {
    setActiveTab(elem);
  };

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"));
if(user){
  navigate("/chats")
}
  })


  return (
    <div className="w-[40%] m-auto mt-4">
      <div className="p-1 bg-white text-black text-center rounded-xl">
        <p className="text-2xl">Talk-A-Tive</p>
      </div>

      <div className=" bg-white text-black rounded-xl mt-3">
        <div className="flex justify-around items-center p-3 gap-5">
          <button
            onClick={() => handleTabClick("login")}
            className="border border-black rounded-full w-full p-1"
          >
            Login
          </button>
          <button
            onClick={() => handleTabClick("signup")}
            className="border border-black rounded-full w-full p-1"
          >
            Sign Up
          </button>
        </div>

        <div className="">
          {
            activeTab === "login" ? 
            <Login />
            : <Signup setActiveTab = {setActiveTab}/>
          }
        </div>
        <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      </div>
    </div>
  );
}

export default Homepage;

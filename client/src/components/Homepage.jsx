import React, { useEffect, useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Homepage() {
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();

  const handleTabClick = (elem) => {
    setActiveTab(elem);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl mx-auto mt-4 px-4">
      <div className="p-4 bg-white text-black text-center rounded-xl shadow-md">
        <p className="text-2xl md:text-3xl font-semibold">Talk-A-Tive</p>
      </div>

      <div className="bg-white text-black rounded-xl mt-4 shadow-md">
        <div className="flex justify-around items-center p-3 gap-3">
          <button
            onClick={() => handleTabClick("login")}
            className={`border border-black rounded-full w-1/2 p-2 text-sm md:text-base ${
              activeTab === "login" ? "bg-blue-600 text-white" : ""
            }`}
          >
            Login
          </button>
          <button
            onClick={() => handleTabClick("signup")}
            className={`border border-black rounded-full w-1/2 p-2 text-sm md:text-base ${
              activeTab === "signup" ? "bg-blue-600 text-white" : ""
            }`}
          >
            Sign Up
          </button>
        </div>

        <div className="p-4">
          {activeTab === "login" ? <Login /> : <Signup setActiveTab={setActiveTab} />}
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
